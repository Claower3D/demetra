package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3030"
	}

	// Create data directory
	dataDir := "./data"
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		log.Fatalf("Failed to create data directory: %v", err)
	}

	// API Handlers
	http.HandleFunc("/api/layout/", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w, r)
		if r.Method == http.MethodOptions {
			return
		}

		pageKey := strings.TrimPrefix(r.URL.Path, "/api/layout/")
		if pageKey == "" {
			http.Error(w, "Missing page key", http.StatusBadRequest)
			return
		}

		filePath := filepath.Join(dataDir, fmt.Sprintf("layout_%s.json", pageKey))

		if r.Method == http.MethodGet {
			if _, err := os.Stat(filePath); os.IsNotExist(err) {
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte("null"))
				return
			}
			http.ServeFile(w, r, filePath)
			return
		}

		if r.Method == http.MethodPost {
			body, err := io.ReadAll(r.Body)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			if err := os.WriteFile(filePath, body, 0644); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"success":true}`))
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	http.HandleFunc("/api/custom-blocks", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w, r)
		if r.Method == http.MethodOptions {
			return
		}

		filePath := filepath.Join(dataDir, "custom_blocks.json")

		if r.Method == http.MethodGet {
			if _, err := os.Stat(filePath); os.IsNotExist(err) {
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte("{}"))
				return
			}
			http.ServeFile(w, r, filePath)
			return
		}

		if r.Method == http.MethodPost {
			body, err := io.ReadAll(r.Body)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			if err := os.WriteFile(filePath, body, 0644); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"success":true}`))
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	http.HandleFunc("/api/pages", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w, r)
		if r.Method == http.MethodOptions {
			return
		}

		filePath := filepath.Join(dataDir, "pages.json")

		if r.Method == http.MethodGet {
			if _, err := os.Stat(filePath); os.IsNotExist(err) {
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte("null"))
				return
			}
			http.ServeFile(w, r, filePath)
			return
		}

		if r.Method == http.MethodPost {
			body, err := io.ReadAll(r.Body)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			if err := os.WriteFile(filePath, body, 0644); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"success":true}`))
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	http.HandleFunc("/api/log", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w, r)
		if r.Method == http.MethodOptions {
			return
		}
		if r.Method == http.MethodPost {
			body, err := io.ReadAll(r.Body)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			f, err := os.OpenFile(filepath.Join(dataDir, "client_errors.log"), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
			if err == nil {
				f.Write(body)
				f.Write([]byte("\n"))
				f.Close()
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"success":true}`))
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	http.HandleFunc("/api/log-get", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w, r)
		filePath := filepath.Join(dataDir, "client_errors.log")
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			w.Header().Set("Content-Type", "text/plain; charset=utf-8")
			w.Write([]byte("No errors logged yet."))
			return
		}
		http.ServeFile(w, r, filePath)
	})

	// Serve Static Frontend Files (SPA Fallback)
	distDir := "./dist"
	fileServer := http.FileServer(http.Dir(distDir))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			http.NotFound(w, r)
			return
		}

		path := filepath.Clean(r.URL.Path)
		fullPath := filepath.Join(distDir, path)

		info, err := os.Stat(fullPath)
		if err != nil || info.IsDir() {
			indexPath := filepath.Join(distDir, "index.html")
			if _, err := os.Stat(indexPath); err == nil {
				http.ServeFile(w, r, indexPath)
			} else {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("Backend is running! Frontend is not built yet."))
			}
			return
		}

		fileServer.ServeHTTP(w, r)
	})

	log.Printf("Go Backend Server starting on port %s", port)
	if err := http.ListenAndServe("0.0.0.0:"+port, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func setupCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}
