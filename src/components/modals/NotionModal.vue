<template>
    <div>
        <h1>Notifications</h1>
        <ul>
            <li v-for="notification in notifications" :key="notification.id">
                {{ notification.title }} - {{ notification.content }}
                <button @click="markAsRead(notification.id)">Mark as Read</button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            notifications: [],
            eventSource: null
        };
    },
    created() {
        this.eventSource = new EventSource('/sse/notifications?userId=' + this.userId);
        this.eventSource.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            if (!this.notifications.some(n => n.id === notification.id)) {
                this.notifications.push(notification);
            }
        };
        this.eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            this.eventSource.close();
        };
    },
    beforeUnmount() {
        this.eventSource.close();
    },
    methods: {
        markAsRead(id) {
            // Mark the notification as read on the server
            fetch(`/notion/markAsRead/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
                .then(data => {
                    this.notifications = this.notifications.filter(n => n.id !== id);
                });
        }
    }
};
</script>
