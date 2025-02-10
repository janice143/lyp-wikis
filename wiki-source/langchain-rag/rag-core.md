# **第三章：构建 RAG 系统的核心流程**

构建 **RAG（检索增强生成）** 系统的核心流程包括数据的预处理、存储、检索、生成增强以及质量评估。本章将详细介绍 RAG 的完整工作流，并提供相应的技术选型和实现策略。

---

## **1. 数据预处理**

在 RAG 系统中，原始数据往往是非结构化的（如 PDF、网页、数据库记录等）。数据预处理的核心任务是**清洗、转换、切分**数据，使其能够高效地被检索和利用。

### **1.1 结构化与非结构化数据处理**

- **结构化数据**：来自数据库、API（如 JSON, CSV）。
- **非结构化数据**：文本文档（PDF, Markdown）、网页、日志等。

#### **处理方法**

- **文本清理**：去除 HTML 标签、特殊符号、无关内容。
- **去重与规范化**：同义词替换、大小写转换、停用词去除。

#### **示例：清理 HTML 文本**

```python
from bs4 import BeautifulSoup

def clean_html(html_text):
    soup = BeautifulSoup(html_text, "html.parser")
    return soup.get_text()

raw_html = "<h1>Hello</h1><p>This is a test.</p>"
clean_text = clean_html(raw_html)
print(clean_text)  # 输出: Hello This is a test.
```

---

### **1.2 文档切分（Chunking）策略**

由于 LLM 有 **Token 限制**（如 GPT-4 上限 8K-32K tokens），长文本需要拆分成**小块（Chunks）**，以便存入向量数据库和检索。

#### **常见的 Chunking 策略**

- **固定长度切分**（如每 512 tokens 一个 chunk）
- **基于句子/段落切分**（NLP 解析后按逻辑单元拆分）
- **滑动窗口**（Overlapping Sliding Window，确保上下文信息）

#### **示例：使用 LangChain 进行 Chunking**

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

text = "LangChain 是一个强大的框架。它支持构建 RAG 应用，并整合向量数据库。"
splitter = RecursiveCharacterTextSplitter(chunk_size=50, chunk_overlap=10)
chunks = splitter.split_text(text)
print(chunks)  # ['LangChain 是一个强大的框架。它支持', '构建 RAG 应用，并整合向量数据库。']
```

---

## **2. 文档存储**

### **2.1 向量数据库选择**

RAG 系统需要高效的向量数据库来存储文档的嵌入表示。常见的向量数据库选项：

| 数据库 | 适用场景 | 特点 |
|--------|---------|------|
| **FAISS** | 本地小规模存储 | 高效但不支持分布式 |
| **Chroma** | 轻量级 Web 端 | 简单易用 |
| **Weaviate** | 适用于企业级 RAG | 支持复杂查询 |
| **Pinecone** | 云端大规模向量存储 | 快速检索，适用于生产环境 |
| **Milvus** | 大规模分布式存储 | 适合超大规模数据 |

#### **示例：使用 FAISS 存储文本嵌入**

```python
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings

texts = ["RAG 是检索增强生成的缩写", "它结合检索和生成提高准确性"]
embeddings = OpenAIEmbeddings()
vector_store = FAISS.from_texts(texts, embedding=embeddings)
```

---

### **2.2 文档索引与嵌入模型**

**嵌入模型** 负责将文本转换为数值向量，使其能够进行相似度搜索。常见的嵌入模型：

- **OpenAI Embeddings（text-embedding-ada-002）**
- **Hugging Face Embeddings（如 all-MiniLM-L6-v2）**
- **BERT-based Models（如 Sentence-BERT）**

#### **示例：使用 OpenAI 生成嵌入**

```python
from openai import OpenAI

openai.api_key = "YOUR_API_KEY"
response = openai.Embedding.create(input="Hello, world!", model="text-embedding-ada-002")
embedding_vector = response['data'][0]['embedding']
```

---

## **3. 检索策略**

### **3.1 关键词检索（BM25）**

BM25（Best Matching 25）是一种基于 **词频-逆文档频率（TF-IDF）** 的传统文本检索算法，适用于搜索引擎和数据库。

#### **示例：使用 Whoosh 实现 BM25**

```python
from whoosh.index import create_in
from whoosh.fields import Schema, TEXT
from whoosh.qparser import QueryParser

schema = Schema(content=TEXT(stored=True))
ix = create_in("indexdir", schema)
```

---

### **3.2 向量相似度搜索**

向量数据库通常使用**余弦相似度（Cosine）、点积（Dot-Product）、欧几里得距离（Euclidean）**等方式计算文本相似性。

#### **示例：FAISS 余弦相似度**

```python
import faiss
import numpy as np

index = faiss.IndexFlatL2(768)  # 768 维度的嵌入
vectors = np.random.rand(10, 768).astype('float32')
index.add(vectors)
```

---

### **3.3 混合检索（Hybrid Search）**

混合检索结合**关键词匹配** + **向量相似度**，提高召回率和精确度。

#### **示例：结合 BM25 + 向量检索**

- 先用 BM25 检索初步筛选相关文档
- 再用向量检索从 BM25 结果中找到最相关的内容

---

## **4. 生成增强**

### **4.1 召回 Top-K 相关文档**

为了提升回答质量，可以检索最相关的前 **K** 篇文档，并拼接到 Prompt 中。

```python
retrieved_docs = retriever.get_relevant_documents("What is LangChain?", k=5)
```

---

### **4.2 结合 Prompt 进行生成**

将检索到的文档信息与用户输入结合，提高生成准确性。

```python
from langchain.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)
result = qa_chain.run("Explain LangChain?")
```

---

### **4.3 使用 LangChain 的 RetrievalQA 组件**

`RetrievalQA` 组件集成了 **检索 + 生成** 的流程，自动完成信息召回和答案生成。

```python
from langchain.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)
result = qa_chain.run("What is RAG?")
print(result)
```

---

## **5. 评估 RAG 质量**

为了衡量 RAG 生成的回答质量，可以使用**自动评估指标**和**LLM 反馈自评估**。

### **5.1 BLEU、ROUGE、Recall@K 指标**

- **BLEU（双语评估理解）**：衡量生成文本与参考文本的相似度，常用于翻译任务。
- **ROUGE（召回导向评估）**：适用于文本摘要，衡量文本的召回率。
- **Recall@K**：表示在前 K 个检索结果中是否包含正确答案。

```python
from rouge import Rouge

rouge = Rouge()
scores = rouge.get_scores("生成文本", "参考文本")
print(scores)
```

---

### **5.2 LLM 反馈自评估**

让 GPT-4 或其他 LLM 评估回答的准确性，并打分。

```python
evaluation_prompt = f"Evaluate the accuracy of the answer: {generated_answer}"
evaluation_score = llm.predict(evaluation_prompt)
```

---

## **总结**

构建 RAG 系统的核心流程包括：
✅ **数据预处理**：清理、切分数据  
✅ **文档存储**：使用向量数据库存储嵌入  
✅ **检索策略**：关键词搜索、向量搜索、混合检索  
✅ **生成增强**：结合 Prompt 和 RetrievalQA 提高质量  
✅ **质量评估**：使用 BLEU、ROUGE 及 LLM 自评估  

下一章节，我们将深入分析 **RAG 在真实场景中的应用与优化策略**，并探讨如何提升 RAG 质量和稳定性。
