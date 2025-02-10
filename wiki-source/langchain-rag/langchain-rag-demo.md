# **第七章：LangChain + RAG 案例实战**

本章将通过**五个 RAG 实战案例**，展示如何利用 **LangChain + 向量数据库 + 大语言模型** 搭建高效的 **知识问答、文档检索、离线 RAG 系统、海量数据检索及交互式 RAG 助手**。

---

## **案例 1：基于 OpenAI API + FAISS 搭建 RAG 知识问答**

**场景**：构建一个 RAG 知识问答系统，用户可以基于自定义文档进行问答，后端使用 **FAISS 向量数据库** 进行检索，前端调用 **OpenAI API** 生成回答。

### **步骤**

1. **安装依赖**

```bash
pip install langchain openai faiss-cpu tiktoken
```

2. **存储文档到 FAISS**

```python
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings

texts = ["RAG 是一种结合检索和生成的 AI 技术。", "LangChain 是用于构建 RAG 系统的框架。"]
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_texts(texts, embedding=embeddings)
```

3. **构建问答系统**

```python
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(model_name="gpt-4")
retriever = vectorstore.as_retriever()
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

query = "什么是 RAG？"
response = qa_chain.run(query)
print(response)
```

✅ **特点**：

- 适用于小型知识库问答，速度快、存储轻量。
- 可用于企业内部 FAQ、产品文档查询等。

---

## **案例 2：使用 ChromaDB 构建本地文档检索系统**

**场景**：ChromaDB 是一个轻量级的本地向量数据库，适用于**个人知识库、代码文档查询、科研文献管理**。

### **步骤**

1. **安装 ChromaDB**

```bash
pip install chromadb langchain
```

2. **创建数据库并存储文档**

```python
import chromadb
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings

chroma_client = chromadb.PersistentClient(path="chroma_db")
vectorstore = Chroma(persist_directory="chroma_db", embedding_function=OpenAIEmbeddings())

texts = ["LangChain 让 AI 应用开发更简单。", "ChromaDB 是一个本地向量数据库。"]
vectorstore.add_texts(texts)
```

3. **查询知识库**

```python
retriever = vectorstore.as_retriever()
query = "LangChain 有什么优势？"
docs = retriever.get_relevant_documents(query)
print(docs)
```

✅ **特点**：

- 适用于本地存储，支持离线查询。
- 适合**个人知识库、科研论文检索**。

---

## **案例 3：LangChain + Hugging Face 搭建离线 RAG 系统**

**场景**：如果你不想依赖 OpenAI，可以使用 Hugging Face 的**开源嵌入模型**，搭建**完全离线的 RAG 系统**。

### **步骤**

1. **安装 Hugging Face 依赖**

```bash
pip install langchain transformers sentence-transformers
```

2. **加载本地嵌入模型**

```python
from langchain.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
```

3. **存储向量数据**

```python
from langchain.vectorstores import FAISS

texts = ["LangChain 是一个用于构建 LLM 应用的框架。", "Hugging Face 提供了很多开源模型。"]
vectorstore = FAISS.from_texts(texts, embedding=embeddings)
```

4. **进行查询**

```python
retriever = vectorstore.as_retriever()
query = "LangChain 是什么？"
docs = retriever.get_relevant_documents(query)
print(docs)
```

✅ **特点**：

- **不依赖 API**，可在本地执行，适用于**高隐私场景**。
- 适用于**企业内网、法律法规、敏感数据查询**。

---

## **案例 4：使用 Pinecone 进行大规模数据检索**

**场景**：如果数据量较大（如**企业文档管理、海量论文、金融数据检索**），可以使用 **Pinecone** 进行高效查询。

### **步骤**

1. **安装 Pinecone**

```bash
pip install pinecone-client langchain
```

2. **初始化 Pinecone**

```python
import pinecone
pinecone.init(api_key="YOUR_API_KEY", environment="us-west1-gcp")

from langchain.vectorstores import Pinecone
vectorstore = Pinecone(index_name="my-index")
```

3. **存储数据**

```python
texts = ["金融市场趋势预测。", "机器学习在金融领域的应用。"]
vectorstore.add_texts(texts)
```

4. **查询数据**

```python
retriever = vectorstore.as_retriever()
query = "金融市场预测"
docs = retriever.get_relevant_documents(query)
print(docs)
```

✅ **特点**：

- 适用于**超大规模数据存储**，支持百万级向量搜索。
- 适合 **企业文档库、金融分析、专利搜索**。

---

## **案例 5：Streamlit 打造交互式 RAG 知识助手**

**场景**：构建一个 **交互式 Web UI**，让用户输入问题，系统从 RAG 知识库中检索并返回答案。

### **步骤**

1. **安装 Streamlit**

```bash
pip install streamlit
```

2. **创建 `app.py`**

```python
import streamlit as st
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI

st.title("RAG 知识问答助手")

query = st.text_input("请输入您的问题:")

if st.button("搜索"):
    retriever = vectorstore.as_retriever()
    qa_chain = RetrievalQA.from_chain_type(llm=ChatOpenAI(), retriever=retriever)
    response = qa_chain.run(query)
    st.write(response)
```

3. **运行 Streamlit**

```bash
streamlit run app.py
```

然后访问 `http://localhost:8501`，即可使用 **RAG 知识助手** 进行问答。

✅ **特点**：

- **可视化交互**，适合**企业内部问答、产品支持、法律咨询**。
- **基于 LangChain + Streamlit**，易于扩展。

---

## **总结**

本章通过 **五个 RAG 案例**，展示了不同场景下的 RAG 应用：
1️⃣ **OpenAI + FAISS**：适合**小型知识库问答**。  
2️⃣ **ChromaDB 本地存储**：适合**个人知识库、科研文献管理**。  
3️⃣ **Hugging Face 离线 RAG**：适合**无 API、数据隐私高的场景**。  
4️⃣ **Pinecone 大规模检索**：适用于**金融、法律、企业文档存储**。  
5️⃣ **Streamlit 可视化 RAG**：打造**交互式 AI 助手**。

在下一章节，我们将讨论 **RAG 的挑战与未来发展**，包括 **数据更新、幻觉问题、计算成本优化等**！ 🚀
