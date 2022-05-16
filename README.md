## Getting Started

Primeiro, build a imagem apartir do Dockerfile:

```bash
docker build -t <tagname> ./
```

Segundo, rode um container apartir da imagem criada:

```bash
docker run -dp 3000:3000 <tagname>
```

Abra [http://localhost:3000](http://localhost:3000) com o seu navegador para ver o resultado.
