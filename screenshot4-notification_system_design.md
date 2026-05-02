# Notification System Design - Stages 1-6

## Stage 1: REST API Design

### Core Actions
- Fetch all notifications for a user
- Fetch unread notifications only
- Mark single notification as read
- Mark all notifications as read
- Get top N priority notifications

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notifications | Get all notifications |
| GET | /notifications/unread | Get unread only |
| PATCH | /notifications/:id/read | Mark one as read |
| PATCH | /notifications/read-all | Mark all as read |
| GET | /notifications/top?n=10 | Get top N by priority |

### Real-time Mechanism
**WebSockets (Socket.io)** - Server pushes new notifications instantly to connected clients.

---

## Stage 2: Database Design

### Choice: PostgreSQL

**Schema:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(20) CHECK (type IN ('Event', 'Result', 'Placement')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_read ON notifications(user_id, is_read, created_at DESC);
