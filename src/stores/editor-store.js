import { defineStore } from 'pinia';
import { api } from '../boot/axios.js';

export const useEditorStore = defineStore('editor', {
  state: () => ({
    node_categories: [],
    nodes: [],
    workflows: [],
    node_items: [],
    connections: [],
  }),

  getters: {
    node_cats(state) {
      return state.node_categories.map((cat) => ({
        ...cat, // Spread the original category properties
        chunk_nodes: state.nodes.filter((node) => node.category === cat.id),
      }));
    },
    node_categories_chunk(state) {
      // Helper function to chunk the array
      const chunkArray = (array, chunkSize) => {
        const chunked = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          chunked.push(array.slice(i, i + chunkSize));
        }
        return chunked;
      };

      return state.node_categories.map((cat) => ({
        ...cat, // Spread the original category properties
        chunk_nodes: chunkArray(
          state.nodes.filter((node) => node.category === cat.id),
          4, // Chunk size of 4
        ),
      }));
    },
    workflow_node_items(state) {
      const { workflows } = state;
      const { connections } = state;
      const nodeItems = state.node_items;

      workflows.forEach((workflow) => {
        workflow.node_items = nodeItems.filter((nod) => nod.workflow === workflow.id);
        workflow.connections = connections.filter((conn) => conn.workflow === workflow.id);
      });
      return workflows;
    },

  },

  actions: {
    async fetchNodeCategories() {
      const response = await api.get('thedataeditor/node_category/');
      this.node_categories = response.data;
    },
    async fetchNodes() {
      const response = await api.get('thedataeditor/node/');
      this.nodes = response.data;
    },
    async fetchWorkflows() {
      const response = await api.get('thedataeditor/');
      this.workflows = response.data;
    },
    async fetchNodeItems() {
      const response = await api.get('thedataeditor/node_item/');
      this.node_items = response.data;
    },
    async fetchConnections() {
      const response = await api.get('thedataeditor/connection/');
      this.connections = response.data;
    },
    async createWorkflow(workflow) {
      const response = await api.post('thedataeditor/', workflow);
      this.workflows.unshift(response.data);
    },
    async editWorkflow(workflow) {
      const response = await api.put(`thedataeditor/${workflow.id}/`, workflow);
      const editedWorkflow = this.workflows.find((wf) => wf.id === workflow.id);
      const index = this.workflows.indexOf(editedWorkflow);
      this.workflows[index] = response.data;
    },
    async deleteWorkflow(workflow) {
      await api.delete(`thedataeditor/${workflow.id}/`);
      const deletedWorkflow = this.workflows.find((wf) => wf.id === workflow.id);
      const index = this.workflows.indexOf(deletedWorkflow);
      this.workflows.splice(index, 1);
    },

  },
});
