# Makefile for running frontend and backend development servers
.PHONY: frontend backend all
frontend:
	cd frontend && npm run dev


backend:
	cd backend && npm run dev

all: frontend backend

# Run both frontend and backend servers concurrently
concurrent:
	@echo "Starting frontend and backend servers concurrently..."
	@cd frontend && npm run dev & cd backend && npm run dev
	@wait
	@echo "Both servers have been started."
# Stop both servers
stop:
	@echo "Stopping frontend and backend servers..."
	@pkill -f "npm run dev" || true
	@echo "Both servers have been stopped."	
# Restart both servers
restart: stop all
restart-concurrent: stop concurrent
	@echo "Both servers have been restarted."		
# Clean up node_modules and reinstall dependencies
clean:
	@echo "Cleaning up node_modules and reinstalling dependencies..."
	@cd frontend && rm -rf node_modules && npm install
	@cd backend && rm -rf node_modules && npm install
	@echo "Cleanup complete."
# Install dependencies for both frontend and backend
install:
	@echo "Installing dependencies for frontend and backend..."
	@cd frontend && npm install
	@cd backend && npm install
	@echo "Dependencies installed."
# Run tests for both frontend and backend
test:
	@echo "Running tests for frontend and backend..."
	@cd frontend && npm test
	@cd backend && npm test
	@echo "Tests completed."

# Build frontend and backend
build:
	@echo "Building frontend and backend..."
	@cd frontend && npm run build
	@cd backend && npm run build
	@echo "Build completed."
