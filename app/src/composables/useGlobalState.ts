import { reactive } from "vue";

const state: {
  listeningAddress: string[];
  listeningPort: number;
  httpAddress: { [key: string]: string };
} = reactive({
  listeningAddress: [],
  listeningPort: 9090,
  httpAddress: {},
});
export function globalState() {
  return {
    ...state,
  };
}
