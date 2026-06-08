package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// CRM Structures
type Lead struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	Phone      string    `json:"phone"`
	Email      string    `json:"email"`
	Message    string    `json:"message"`
	Status     string    `json:"status"` // new, processing, completed, rejected
	CreatedAt  time.Time `json:"created_at"`
	Amount     float64   `json:"amount"`
	Source     string    `json:"source"`
	AssignedTo string    `json:"assigned_to"`
	Comments   string    `json:"comments"`
}

type CRMUser struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Role   string `json:"role"` // admin, manager, specialist, auditor
	Status string `json:"status"` // active, inactive
	Email  string `json:"email"`
	Avatar string `json:"avatar"`
}

type ChatMessage struct {
	Sender    string    `json:"sender"` // client, operator
	Text      string    `json:"text"`
	Timestamp time.Time `json:"timestamp"`
}

type CRMChat struct {
	ID          string        `json:"id"`
	ClientPhone string        `json:"client_phone"`
	ClientName  string        `json:"client_name"`
	Messages    []ChatMessage `json:"messages"`
}

type CRMRolePermissions struct {
	Role        string   `json:"role"`
	AllowedTabs []string `json:"allowed_tabs"`
}

var (
	fileMutex sync.Mutex
)

func initCRMData(dataDir string) {
	leadsFile := filepath.Join(dataDir, "crm_leads.json")
	usersFile := filepath.Join(dataDir, "crm_users.json")
	chatsFile := filepath.Join(dataDir, "crm_chats.json")

	// 1. Initial Leads
	if _, err := os.Stat(leadsFile); os.IsNotExist(err) {
		now := time.Now()
		defaultLeads := []Lead{
			{
				ID:         "lead_1",
				Name:       "Илья Соколов",
				Phone:      "+7 (701) 555-01-23",
				Email:      "s_ilya@mail.ru",
				Message:    "Нужен расчет стоимости конвейерной ленты 1200мм для шахты им. Костенко. Длина 300 метров.",
				Status:     "new",
				CreatedAt:  now.Add(-2 * time.Hour),
				Amount:     0,
				Source:     "Форма контактов",
				AssignedTo: "Светлана Иванова",
				Comments:   "Связаться в течение дня, подготовить предварительный опросный лист.",
			},
			{
				ID:         "lead_2",
				Name:       "Арман Сабитов",
				Phone:      "+7 (777) 123-45-67",
				Email:      "arman@demetra.kz",
				Message:    "Заказ на стыковку резинотканевой ленты методом горячей вулканизации. Срочно!",
				Status:     "processing",
				CreatedAt:  now.Add(-26 * time.Hour),
				Amount:     450000,
				Source:     "Баннер обратной связи",
				AssignedTo: "Ербол Маратов",
				Comments:   "Бригада выехала на замеры. Договор на стадии подписания.",
			},
			{
				ID:         "lead_3",
				Name:       "Алина Рахимова",
				Phone:      "+7 (705) 987-65-43",
				Email:      "alina.r@gmail.com",
				Message:    "Интересует резинокерамическая футеровка приводных барабанов для предотвращения проскальзывания ленты.",
				Status:     "completed",
				CreatedAt:  now.Add(-74 * time.Hour),
				Amount:     820000,
				Source:     "Заявка из каталога",
				AssignedTo: "Ербол Маратов",
				Comments:   "Работы успешно завершены. Акт выполненных работ подписан заказчиком без нареканий.",
			},
			{
				ID:         "lead_4",
				Name:       "Дмитрий Воронов",
				Phone:      "+7 (700) 111-22-33",
				Email:      "voronov@promtech.kz",
				Message:    "Поставка конвейерных роликов HDPE 250 шт по чертежам заказчика.",
				Status:     "completed",
				CreatedAt:  now.Add(-120 * time.Hour),
				Amount:     1250000,
				Source:     "Форма контактов",
				AssignedTo: "Светлана Иванова",
				Comments:   "Оплата получена 100%. Ролики отгружены со склада, доставка завершена.",
			},
			{
				ID:         "lead_5",
				Name:       "Сакен Нуртаев",
				Phone:      "+7 (707) 333-44-55",
				Email:      "saken@nurtas.kz",
				Message:    "Запрос прайс-листа на полимерные ролики и амортизирующие станции.",
				Status:     "rejected",
				CreatedAt:  now.Add(-140 * time.Hour),
				Amount:     0,
				Source:     "Форма контактов",
				AssignedTo: "Светлана Иванова",
				Comments:   "Не устраивают сроки поставки (нужно было вчера). Ушли к конкурентам.",
			},
		}
		data, _ := json.MarshalIndent(defaultLeads, "", "  ")
		os.WriteFile(leadsFile, data, 0644)
	}

	// 2. Initial Users
	if _, err := os.Stat(usersFile); os.IsNotExist(err) {
		defaultUsers := []CRMUser{
			{
				ID:     "user_1",
				Name:   "Администратор",
				Role:   "admin",
				Status: "active",
				Email:  "admin@demetra.kz",
				Avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
			},
			{
				ID:     "user_2",
				Name:   "Светлана Иванова",
				Role:   "manager",
				Status: "active",
				Email:  "ivanova@demetra.kz",
				Avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
			},
			{
				ID:     "user_3",
				Name:   "Ербол Маратов",
				Role:   "specialist",
				Status: "active",
				Email:  "maratov@demetra.kz",
				Avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
			},
			{
				ID:     "user_4",
				Name:   "Виктор Ким",
				Role:   "auditor",
				Status: "inactive",
				Email:  "kim@demetra.kz",
				Avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
			},
		}
		data, _ := json.MarshalIndent(defaultUsers, "", "  ")
		os.WriteFile(usersFile, data, 0644)
	}

	// 3. Initial Chats
	if _, err := os.Stat(chatsFile); os.IsNotExist(err) {
		now := time.Now()
		defaultChats := []CRMChat{
			{
				ID:          "chat_1",
				ClientPhone: "+7 (701) 555-01-23",
				ClientName:  "Илья Соколов",
				Messages: []ChatMessage{
					{
						Sender:    "client",
						Text:      "Здравствуйте! Скажите, пожалуйста, сколько времени займет изготовление ленты шириной 1200 мм?",
						Timestamp: now.Add(-2 * time.Hour),
					},
					{
						Sender:    "operator",
						Text:      "Добрый день, Илья! Обычно изготовление и нарезка занимают от 3 до 5 рабочих дней в зависимости от загрузки нашего производства в Караганде.",
						Timestamp: now.Add(-1 * time.Hour - 45 * time.Minute),
					},
					{
						Sender:    "client",
						Text:      "Отлично, а доставка до Балхаша возможна?",
						Timestamp: now.Add(-1 * time.Hour - 30 * time.Minute),
					},
					{
						Sender:    "operator",
						Text:      "Да, конечно. Мы отправляем продукцию по всему Казахстану, включая Балхаш, Жезказган и Усть-Каменогорск. Можем включить доставку в общий счет.",
						Timestamp: now.Add(-1 * time.Hour - 15 * time.Minute),
					},
					{
						Sender:    "client",
						Text:      "Тогда жду коммерческое предложение на почту.",
						Timestamp: now.Add(-1 * time.Hour),
					},
				},
			},
			{
				ID:          "chat_2",
				ClientPhone: "+7 (777) 123-45-67",
				ClientName:  "Арман Сабитов",
				Messages: []ChatMessage{
					{
						Sender:    "client",
						Text:      "Приветствую! Нам нужен срочный ремонт ленты. Порвалась на стыке.",
						Timestamp: now.Add(-26 * time.Hour),
					},
					{
						Sender:    "operator",
						Text:      "Здравствуйте, Арман! Заявку принял. Выслал бригаду вулканизаторщиков Ербола Маратова. Будут у вас через 2 часа.",
						Timestamp: now.Add(-25 * time.Hour - 40 * time.Minute),
					},
					{
						Sender:    "client",
						Text:      "Спасибо за оперативность! Ждем.",
						Timestamp: now.Add(-25 * time.Hour - 30 * time.Minute),
					},
				},
			},
		}
		data, _ := json.MarshalIndent(defaultChats, "", "  ")
		os.WriteFile(chatsFile, data, 0644)
	}

	permissionsFile := filepath.Join(dataDir, "crm_permissions.json")
	if _, err := os.Stat(permissionsFile); os.IsNotExist(err) {
		defaultPermissions := []CRMRolePermissions{
			{Role: "admin", AllowedTabs: []string{"analytics", "leads", "clients", "chats", "users"}},
			{Role: "manager", AllowedTabs: []string{"analytics", "leads", "clients", "chats"}},
			{Role: "specialist", AllowedTabs: []string{"leads", "chats"}},
			{Role: "auditor", AllowedTabs: []string{"analytics", "leads"}},
		}
		data, _ := json.MarshalIndent(defaultPermissions, "", "  ")
		os.WriteFile(permissionsFile, data, 0644)
	}
}

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

	// Initialize CRM default JSONs
	initCRMData(dataDir)

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

	// CRM ENDPOINTS WITH THREAD SAFETY
	http.HandleFunc("/api/crm/leads", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w, r)
		if r.Method == http.MethodOptions {
			return
		}

		filePath := filepath.Join(dataDir, "crm_leads.json")

		fileMutex.Lock()
		defer fileMutex.Unlock()

		if r.Method == http.MethodGet {
			if _, err := os.Stat(filePath); os.IsNotExist(err) {
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte("[]"))
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

	// Endpoint to submit a new lead from the frontend forms
	http.HandleFunc("/api/crm/leads/submit", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w, r)
		if r.Method == http.MethodOptions {
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var input struct {
			Name    string  `json:"name"`
			Phone   string  `json:"phone"`
			Email   string  `json:"email"`
			Message string  `json:"message"`
			Source  string  `json:"source"`
			Amount  float64 `json:"amount"`
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading body", http.StatusBadRequest)
			return
		}

		if err := json.Unmarshal(body, &input); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		filePath := filepath.Join(dataDir, "crm_leads.json")

		fileMutex.Lock()
		defer fileMutex.Unlock()

		var leads []Lead
		if _, err := os.Stat(filePath); err == nil {
			data, err := os.ReadFile(filePath)
			if err == nil {
				json.Unmarshal(data, &leads)
			}
		}

		newLead := Lead{
			ID:         fmt.Sprintf("lead_%d", time.Now().UnixNano()),
			Name:       input.Name,
			Phone:      input.Phone,
			Email:      input.Email,
			Message:    input.Message,
			Status:     "new",
			CreatedAt:  time.Now(),
			Amount:     input.Amount,
			Source:     input.Source,
			AssignedTo: "Светлана Иванова",
			Comments:   "Создано автоматически с веб-сайта.",
		}

		if newLead.Name == "" {
			newLead.Name = "Анонимный клиент"
		}
		if newLead.Source == "" {
			newLead.Source = "Форма сайта"
		}

		leads = append([]Lead{newLead}, leads...) // Add to the top of list
		newData, err := json.MarshalIndent(leads, "", "  ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := os.WriteFile(filePath, newData, 0644); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Also auto-create a chat thread for this client phone if it doesn't exist yet!
		chatsFile := filepath.Join(dataDir, "crm_chats.json")
		var chats []CRMChat
		if _, err := os.Stat(chatsFile); err == nil {
			cData, err := os.ReadFile(chatsFile)
			if err == nil {
				json.Unmarshal(cData, &chats)
			}
		}

		phoneExists := false
		for _, c := range chats {
			if c.ClientPhone == newLead.Phone {
				phoneExists = true
				break
			}
		}

		if !phoneExists && newLead.Phone != "" {
			newChat := CRMChat{
				ID:          fmt.Sprintf("chat_%d", time.Now().UnixNano()),
				ClientPhone: newLead.Phone,
				ClientName:  newLead.Name,
				Messages: []ChatMessage{
					{
						Sender:    "client",
						Text:      fmt.Sprintf("[Авто-сообщение с сайта] Оставлена заявка: \"%s\". Дополнительное сообщение: \"%s\"", newLead.Source, newLead.Message),
						Timestamp: time.Now(),
					},
				},
			}
			chats = append([]CRMChat{newChat}, chats...)
			cData, _ := json.MarshalIndent(chats, "", "  ")
			os.WriteFile(chatsFile, cData, 0644)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"success":true,"message":"Lead added successfully"}`))
	})

	http.HandleFunc("/api/crm/users", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w, r)
		if r.Method == http.MethodOptions {
			return
		}

		filePath := filepath.Join(dataDir, "crm_users.json")

		fileMutex.Lock()
		defer fileMutex.Unlock()

		if r.Method == http.MethodGet {
			if _, err := os.Stat(filePath); os.IsNotExist(err) {
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte("[]"))
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

	http.HandleFunc("/api/crm/chats", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w, r)
		if r.Method == http.MethodOptions {
			return
		}

		filePath := filepath.Join(dataDir, "crm_chats.json")

		fileMutex.Lock()
		defer fileMutex.Unlock()

		if r.Method == http.MethodGet {
			if _, err := os.Stat(filePath); os.IsNotExist(err) {
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte("[]"))
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

	http.HandleFunc("/api/crm/permissions", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w, r)
		if r.Method == http.MethodOptions {
			return
		}

		filePath := filepath.Join(dataDir, "crm_permissions.json")

		fileMutex.Lock()
		defer fileMutex.Unlock()

		if r.Method == http.MethodGet {
			if _, err := os.Stat(filePath); os.IsNotExist(err) {
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte("[]"))
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
