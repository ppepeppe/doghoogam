/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../pages/api/index";

interface Location {
  lat: number;
  lng: number;
}

interface Dog {
  birthday: string;
  dogBreed: string;
  dogCharacter: string;
  dogImg: string;
  dogName: string;
  hide: boolean;
  pk: number;
  transactionHash: string;
}

interface WalkState {
  isWalkingStarted: boolean;
  selectedDogs: any[];
  totalDist: string;
  isPaused: boolean;
  personId: string;
  center: {
    lat: number;
    lng: number;
  };
  paths: Location[];
  time: number;
  others: any[];
  dogState: number;
  myDogs: Dog[];
  coin: number;
  isCoinLoading: boolean;
}

const initialState: WalkState = {
  isWalkingStarted: false,
  selectedDogs: [],
  totalDist: "0.00",
  isPaused: false,
  personId: "",
  center: {
    lat: 0,
    lng: 0
  },
  paths: [],
  time: 0,
  others: [],
  dogState: 0,
  myDogs: [],
  coin: 0,
  isCoinLoading: false
};

export const startWalkingApi = async (data: any) => {
  const res = await axios.post("/walk", data);
  return res.data;
};

export const nowWalkingApi = async (data: any) => {
  const res = await axios.post("/walk/walking", data);
  return res.data;
};

type Any = any;

export const finishWalkingApi = createAsyncThunk<Any>(
  "walk/finishWalking",
  async (_, { getState }) => {
    const state: any = getState();
    try {
      const res = await axios.post("/walk/end", {
        coin: state.walk.coin,
        distance: +state.walk.totalDist,
        walkPath: state.walk.paths,
        time: state.walk.time
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const getMyDogs = async () => {
  const res = await axios.get("/dog");
  return res.data;
};

export const getOtherDogs = async (data: any[]) => {
  const res = await axios.post("/dog/list", data);
  return res.data;
};

export const getFeeds = async () => {
  const res = await axios.get("/feed");
  return res.data;
};

const walkSlice = createSlice({
  name: "walk",
  initialState,
  reducers: {
    startWalking: (state, { payload }) => {
      state.isWalkingStarted = true;
      state.personId = payload;
    },
    finishWalking: (state) => {
      state.isWalkingStarted = false;
    },
    toggleSelectedDogs: (state, { payload }) => {
      if (state.selectedDogs.find((dog) => dog.id === payload.id)) {
        state.selectedDogs = state.selectedDogs.filter(
          (dog) => dog.id !== payload.id
        );
      } else {
        state.selectedDogs.push(payload);
      }
    },
    pushPaths: (state, { payload }) => {
      if (state.paths.length > 1) {
        const lastPosition = state.paths[state.paths.length - 1];
        if (
          lastPosition.lat === payload.lat &&
          lastPosition.lng === payload.lng
        )
          return;
      }
      state.paths.push(payload);
    },
    saveDistance: (state, { payload }) => {
      let tmp = +state.totalDist + payload;
      tmp = parseFloat(tmp.toString()).toFixed(2);
      tmp = parseFloat(tmp).toFixed(2);
      state.totalDist = tmp;
    },
    restartWalking: (state) => {
      state.isPaused = false;
    },
    pauseWalking: (state) => {
      state.isPaused = true;
    },
    saveTime: (state, { payload }) => {
      state.time = payload;
    },
    toggleDogState: (state, { payload }) => {
      state.dogState = payload;
    },
    setMyDogs: (state, { payload }) => {
      state.myDogs = payload;
    },
    saveCoin: (state, { payload }) => {
      state.coin = payload;
    },
    setIsCoinLoading: (state, { payload }) => {
      state.isCoinLoading = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(finishWalkingApi.fulfilled, (state) => {
      state.isWalkingStarted = false;
      state.selectedDogs = [];
      state.totalDist = "0.00";
      state.isPaused = false;
      state.personId = "";
      state.center = {
        lat: 0,
        lng: 0
      };
      state.paths = [];
      state.time = 0;
      state.others = [];
      state.dogState = 0;
      state.coin = 0;
    });
  }
});

export const {
  startWalking,
  finishWalking,
  toggleSelectedDogs,
  pushPaths,
  saveDistance,
  pauseWalking,
  restartWalking,
  saveTime,
  toggleDogState,
  setMyDogs,
  saveCoin,
  setIsCoinLoading
} = walkSlice.actions;
export default walkSlice.reducer;
