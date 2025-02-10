# **第五章：RAG 进阶优化**

基础 RAG 系统能够执行基本的检索与生成任务，但在实际应用中，系统的**检索准确性、生成质量和性能**仍有很大的优化空间。本章将介绍 RAG 进阶优化策略，包括：
✅ **提升检索效果**（动态 Top-K 选择、Reranking）  
✅ **优化生成部分**（自适应 Prompt 设计、Few-shot 提示）  
✅ **缓存与性能优化**（Redis / LlamaIndex 缓存、预计算嵌入）  
✅ **长文本处理**（Recursive Text Splitting, Sliding Window）  

---

## **1. 提升检索效果**

检索是 RAG 系统的核心，如果检索不到高质量的上下文，LLM 也无法生成准确的回答。本节介绍动态 Top-K 选择和 Reranking（重排序）优化检索效果。

### **1.1 动态 Top-K 选择**

**问题：**

- 选择过多的检索文档会导致无关信息干扰 LLM。
- 选择过少可能导致关键信息缺失。

**解决方案：**
动态调整 `Top-K`（检索返回的文档数量），根据 **查询类型** 或 **文本相似度分数** 设定最优 K 值。

```python
def dynamic_top_k(retriever, query, max_k=10, threshold=0.75):
    docs = retriever.get_relevant_documents(query, k=max_k)
    filtered_docs = [doc for doc in docs if doc.metadata['score'] >= threshold]
    return filtered_docs[:len(filtered_docs) or 3]  # 确保至少返回 3 个
```

---

### **1.2 Reranking（重排序）**

**问题：**

- 向量检索可能返回相关性较低的文档。
- 需要额外的排序逻辑提升准确性。

**解决方案：**
使用 **Cross-Encoder（如 Cohere Reranker）** 进行重新排序，确保更优的上下文排在前面。

#### **使用 Cohere Reranker**

```python
from langchain.embeddings.cohere import CohereReranker

reranker = CohereReranker(model="rerank-english-v2.0")
reranked_docs = reranker.rerank(query, retrieved_docs)
```

这种方式可以让真正重要的信息排在前面，提高 LLM 生成的准确性。

---

## **2. 优化生成部分**

即使检索结果很精准，**LLM 的回答质量** 仍然受 **Prompt 设计** 和 **上下文控制** 影响。本节介绍如何改进 Prompt 设计，使生成结果更稳定。

### **2.1 自适应 Prompt 设计**

**问题：**

- 统一 Prompt 可能无法适应不同类型的查询。
- 需要针对不同任务动态调整 Prompt。

**解决方案：**
根据查询类型调整 Prompt，例如：

- **定义问题的领域**（医学 / 法律 / 技术）。
- **明确回答的格式**（列表 / 详细解析 / 摘要）。

#### **示例：自适应 Prompt**

```python
from langchain.prompts import PromptTemplate

def generate_prompt(query, context):
    if "法律" in query:
        template = "根据以下法律信息：{context}，请提供专业法律解读。问题：{query}"
    else:
        template = "请基于以下信息回答问题：{context}，问题：{query}"
    return PromptTemplate(template=template).format(context=context, query=query)
```

---

### **2.2 Few-shot 提示优化**

**问题：**

- Zero-shot 可能导致模型无法理解任务。
- 需要提供示例（Few-shot Learning）以提高回答质量。

**解决方案：**
在 Prompt 中添加示例，使 LLM 参考过去的高质量答案。

```python
few_shot_prompt = """示例：
用户：如何优化 RAG 系统？
AI：可以使用动态 Top-K、Reranking 和缓存优化。

用户：{query}
AI：
"""
```

这种方式可以 **显著提升 LLM 的回答一致性**。

---

## **3. 缓存与性能优化**

调用大模型（如 GPT-4）成本较高，并且响应速度可能较慢。我们可以使用 **缓存** 机制减少 API 调用次数，并优化嵌入存储。

### **3.1 使用 Redis 进行缓存**

使用 **Redis** 存储查询的历史结果，减少重复计算。

#### **安装 Redis**

```bash
pip install redis
```

#### **缓存查询结果**

```python
import redis
import json

cache = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_response(query):
    return cache.get(query)

def save_to_cache(query, response):
    cache.set(query, json.dumps(response), ex=3600)  # 1小时过期
```

**效果**：

- **减少 API 调用成本**，加速响应时间。
- **缓存高频查询**，避免重复计算。

---

### **3.2 预计算嵌入减少 API 调用**

嵌入计算（Embedding）通常会占用大量 API 费用，我们可以 **预计算** 重要文本的嵌入，并存储到向量数据库。

```python
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings

# 计算并存储嵌入
texts = ["RAG 是什么？", "如何优化 RAG？"]
embeddings = OpenAIEmbeddings()
vector_store = FAISS.from_texts(texts, embedding=embeddings)

# 查询时直接检索已有嵌入
retriever = vector_store.as_retriever()
retrieved_docs = retriever.get_relevant_documents("RAG 的作用？")
```

**优势**：

- **减少 API 调用**，降低 OpenAI 费用。
- **查询速度更快**，提高响应效率。

---

## **4. 长文本处理优化**

当文档较长时，直接将全部内容输入 LLM **不可行**，因为会超出 Token 限制。本节介绍 **递归文本切分** 和 **滑动窗口策略** 处理长文本。

### **4.1 Recursive Text Splitting（递归文本切分）**

将文本按照 **层级** 进行切分（如按章节 → 段落 → 句子），确保内容结构完整。

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
chunks = splitter.split_text("这是一段长文本...")
```

**优势**：

- **减少信息丢失**，比固定切分方式更智能。
- **提升检索效果**，让每个 chunk 具备更完整的语义信息。

---

### **4.2 Sliding Window（滑动窗口）**

使用 **滑动窗口**（Sliding Window）确保相邻文本块有一定 **重叠**，让 LLM 仍然能保持上下文。

```python
def sliding_window_split(text, window_size=512, overlap=100):
    chunks = []
    for i in range(0, len(text), window_size - overlap):
        chunks.append(text[i:i + window_size])
    return chunks
```

**优势**：

- **减少上下文断裂**，让 LLM 生成更自然的答案。
- **适用于法律、医学、长论文等复杂文档**。

---

## **总结**

本章介绍了 RAG 进阶优化的核心技术：
✅ **提升检索效果**：动态 Top-K 选择、Reranking 重排序  
✅ **优化生成部分**：自适应 Prompt、Few-shot 提示提升 LLM 质量  
✅ **缓存与性能优化**：Redis 缓存、预计算嵌入减少 API 费用  
✅ **长文本处理**：Recursive Text Splitting、Sliding Window 解决 Token 限制  

在下一章节，我们将探讨 **RAG 在实际应用中的案例分析**，包括如何落地到 **企业知识库、智能客服、法律问答等业务场景**！ 🚀
