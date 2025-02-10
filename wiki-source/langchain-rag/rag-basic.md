# **第四章：搭建基础 RAG 应用**

本章将带你 **从零搭建一个基础的 RAG（检索增强生成）系统**，包括：
✅ **环境搭建**（Python 依赖、API Key 配置）  
✅ **文档检索**（读取文本、存入向量数据库）  
✅ **结合 LLM 进行问答**（RetrievalQA）  
✅ **运行与测试**（终端交互 & Streamlit Web UI）

---

## **1. 环境搭建**

RAG 需要集成多个工具，包括 **大语言模型（LLM）、向量数据库（Vector Store）、文档处理（PDF, Web Scraper）等**。我们将使用 **LangChain** 框架，它可以轻松整合这些组件。

### **1.1 安装 Python 依赖**

使用 `pip` 安装 RAG 相关的依赖：

```bash
pip install langchain openai faiss-cpu chromadb tiktoken beautifulsoup4 pdfplumber streamlit
```

#### **依赖介绍**

- `langchain`：RAG 组件框架
- `openai`：调用 GPT-4 / GPT-3.5
- `faiss-cpu`：本地向量数据库
- `chromadb`：轻量级向量数据库
- `pdfplumber`：处理 PDF
- `beautifulsoup4`：解析网页 HTML
- `streamlit`：构建 Web UI

---

### **1.2 配置 API Key**

RAG 需要调用大语言模型（如 OpenAI、Hugging Face），需要设置 API Key。

#### **设置 OpenAI API Key**

```bash
export OPENAI_API_KEY="your-api-key"
```

或在 Python 代码中：

```python
import os
os.environ["OPENAI_API_KEY"] = "your-api-key"
```

#### **可选：Hugging Face Embeddings**

```bash
export HUGGINGFACE_API_KEY="your-hf-api-key"
```

---

## **2. 实现文档检索**

### **2.1 读取文本、PDF、网页数据**

RAG 需要从多个来源获取数据，我们先实现 **从文本、PDF 和网页提取数据**。

#### **2.1.1 读取文本文件**

```python
def read_text_file(filepath):
    with open(filepath, "r", encoding="utf-8") as file:
        return file.read()
```

#### **2.1.2 解析 PDF**

```python
import pdfplumber

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text
```

#### **2.1.3 爬取网页内容**

```python
import requests
from bs4 import BeautifulSoup

def scrape_webpage(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    return soup.get_text()
```

---

### **2.2 处理文本并存入向量数据库**

为了支持高效检索，我们需要将数据转换为向量，并存入向量数据库（FAISS / ChromaDB）。

#### **2.2.1 文本切分**

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

def split_text(text, chunk_size=512, chunk_overlap=50):
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return splitter.split_text(text)
```

#### **2.2.2 生成文本向量**

```python
from langchain.embeddings.openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()
vector = embeddings.embed_query("What is RAG?")
```

#### **2.2.3 存储到 FAISS**

```python
from langchain.vectorstores import FAISS

def store_in_faiss(texts):
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts, embedding=embeddings)
    return vectorstore

vectorstore = store_in_faiss(["RAG is a framework that integrates retrieval and generation."])
```

---

## **3. 结合 LLM 进行问答**

### **3.1 基础 RetrievalQA 示例**

现在我们将 `FAISS` 向量数据库与 GPT-4 结合，构建 **RAG 问答系统**。

```python
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(model_name="gpt-4")

retriever = vectorstore.as_retriever()
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

query = "What is RAG?"
response = qa_chain.run(query)
print(response)
```

---

### **3.2 设定 Prompt 结构优化生成**

Prompt 设计会影响生成质量，我们可以使用 LangChain 的 `PromptTemplate` 进行优化。

```python
from langchain.prompts import PromptTemplate

prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="Based on the following context: {context}, answer the question: {question}"
)
```

然后将 Prompt 结合 RetrievalQA：

```python
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, prompt=prompt)
```

---

## **4. 运行与测试**

### **4.1 终端交互式问答**

我们可以创建一个 **交互式 CLI RAG 机器人**。

```python
def interactive_qa():
    print("RAG Bot: Ask me anything! (type 'exit' to quit)")
    while True:
        query = input("You: ")
        if query.lower() == "exit":
            break
        response = qa_chain.run(query)
        print(f"RAG Bot: {response}")

interactive_qa()
```

---

### **4.2 Streamlit 可视化 Web UI**

我们可以用 **Streamlit** 构建一个 Web 界面，展示 RAG 结果。

#### **安装 Streamlit**

```bash
pip install streamlit
```

#### **创建 `app.py`**

```python
import streamlit as st

st.title("RAG 文档问答系统")

query = st.text_input("请输入你的问题:")
if st.button("搜索"):
    response = qa_chain.run(query)
    st.write(response)
```

#### **运行 Web UI**

```bash
streamlit run app.py
```

然后访问 `http://localhost:8501`，即可看到一个简易的 RAG UI。

---

## **总结**

本章实现了一个完整的 **基础 RAG 系统**，包括：
✅ **环境搭建**（安装依赖 & 配置 API Key）  
✅ **文档检索**（文本、PDF、网页）  
✅ **向量数据库存储**（FAISS, OpenAI Embeddings）  
✅ **结合 LLM 生成答案**（GPT-4, LangChain RetrievalQA）  
✅ **运行测试**（CLI 交互 & Streamlit Web UI）  

在下一章节，我们将**深入优化 RAG 系统**，提高召回精度、增强 Prompt 设计，并探索混合检索（Hybrid Search）等高级技术！ 🚀
