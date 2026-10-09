import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "../api/aucationApi";
import { unwrap } from "../../../helpers/apiHelper";

export const useAucationsStore = defineStore("aucations", () => {
  const aucations = ref([]);
  const aucation = ref(null);
  const isAucation = ref(false);

  const isAucationAdd = ref(false);
  const isAucationAdded = ref(false);
  const isAucationChange = ref(false);
  const isAucationChanged = ref(false);
  const isAucationChangeCover = ref(false);
  const isAucationChangedCover = ref(false);
  const isAucationDelete = ref(false);
  const isAucationDeleted = ref(false);
  const isBidAdd = ref(false);
  const isBidAdded = ref(false);
  const isBidDelete = ref(false);
  const isBidDeleted = ref(false);
  const isAucationDeleteAll = ref(false);
  const isAucationDeletedAll = ref(false);

  async function load(target, call) {
    isAucation.value = true;
    try {
      target.value = await call();
    } finally {
      isAucation.value = false;
    }
  }

  const fetchAucations = (params = {}) =>
    load(aucations, async () => unwrap(await api.getAucations(params), "aucations") ?? []);
  const fetchAucation = (id) => {
    aucation.value = null;
    return load(aucation, async () => unwrap(await api.getAucation(id), "aucation"));
  };

  async function mutate(busy, done, call) {
    busy.value = true;
    done.value = false;
    try {
      const json = await call();
      done.value = true;
      return json.message;
    } finally {
      busy.value = false;
    }
  }

  const addAucation = (body) => mutate(isAucationAdd, isAucationAdded, () => api.postAucation(body));
  const changeAucation = (id, body) =>
    mutate(isAucationChange, isAucationChanged, () => api.putAucation(id, body));
  const changeCover = (id, form) =>
    mutate(isAucationChangeCover, isAucationChangedCover, () => api.postCover(id, form));
  const removeAucation = (id) => mutate(isAucationDelete, isAucationDeleted, () => api.deleteAucation(id));
  const addBid = (id, body) => mutate(isBidAdd, isBidAdded, () => api.postBid(id, body));
  const removeBid = (id) => mutate(isBidDelete, isBidDeleted, () => api.deleteBid(id));
  const removeAllAucations = () =>
    mutate(isAucationDeleteAll, isAucationDeletedAll, () => api.deleteAllAucations());

  return {
    aucations, aucation, isAucation,
    isAucationAdd, isAucationAdded, isAucationChange, isAucationChanged,
    isAucationChangeCover, isAucationChangedCover, isAucationDelete, isAucationDeleted,
    isBidAdd, isBidAdded, isBidDelete, isBidDeleted, isAucationDeleteAll, isAucationDeletedAll,
    fetchAucations, fetchAucation, addAucation, changeAucation, changeCover,
    removeAucation, addBid, removeBid, removeAllAucations,
  };
});
