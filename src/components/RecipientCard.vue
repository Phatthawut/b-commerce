<template>
  <div class="recipient-card">
    <div class="recipient-header">
      <h3>{{ recipient.name }}</h3>
      <span class="badge">{{ recipient.category }}</span>
    </div>
    <div class="recipient-location">
      <div><strong>Region:</strong> {{ region.name }}</div>
      <div><strong>Country:</strong> {{ recipient.country }}</div>
    </div>
    <div class="recipient-address">
      <strong>Address:</strong>
      <p>{{ recipient.address }}</p>
    </div>
    <div class="recipient-actions">
      <button @click="viewDetails" class="btn-view">View Details</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipientCard",
  props: {
    recipient: {
      type: Object,
      required: true,
    },
    region: {
      type: Object,
      required: true,
    },
  },
  methods: {
    viewDetails() {
      this.$emit("view", this.recipient);
    },
  },
};
</script>

<style>
.recipient-card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.recipient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.recipient-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.recipient-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.badge {
  background-color: #e9f5ff;
  color: #0077cc;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.recipient-location {
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.recipient-address {
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.recipient-address p {
  margin: 4px 0 0;
  color: #666;
}

.recipient-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-view {
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-view:hover {
  background-color: #005fa3;
}
</style>
