# Stage 1: Build Go backend
FROM golang:1.22-alpine AS go-builder
WORKDIR /app
COPY backend/go.mod ./backend/
COPY backend/main.go ./backend/
RUN cd backend && go build -o /app/server main.go

# Stage 2: Build React frontend
FROM node:22-alpine AS node-builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npx tsc -b && npx vite build

# Stage 3: Final runtime image
FROM alpine:latest
WORKDIR /app

# Copy built binary from go stage
COPY --from=go-builder /app/server ./server

# Copy built frontend from node stage
COPY --from=node-builder /app/dist ./dist

# Make server executable
RUN chmod +x ./server

EXPOSE 3030

CMD ["./server"]
