# Local AI design

AI functionality is intentionally deferred until Phase 6. It will use Ollama,
which runs an open-weight model locally and does not require an API key.

The server will expose an `AIProvider` interface and implement it first with an
`OllamaProvider`. This keeps analysis code independent of a specific model or
inference runtime. The recommended starting model will be a laptop-friendly
Qwen or Llama variant selected and documented during that phase.

Resume text will remain on the local machine: the application will send it only
to the locally configured Ollama endpoint. No paid AI API is part of the
architecture.
