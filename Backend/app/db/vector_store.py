import chromadb
from chromadb.config import Settings
from app.config import settings

# Persistent Client
client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)

# Get or create collection
collection = client.get_or_create_collection(
    name="siddha_books",
    metadata={"hnsw:space": "cosine"},  # Cosine similarity
)


def add_documents(
    ids: list[str],
    documents: list[str],
    embeddings: list[list[float]],
    metadatas: list[dict],
):
    """
    Adds documents + embeddings to ChromaDB.
    """
    collection.add(
        ids=ids, documents=documents, embeddings=embeddings, metadatas=metadatas
    )


def query_documents(query_embedding: list[float], n_results: int = 5):
    """
    Queries ChromaDB for similar documents.
    """
    results = collection.query(query_embeddings=[query_embedding], n_results=n_results)
    return results
