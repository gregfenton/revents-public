import { createReducer } from "../../app/common/util/reducerUtils";
import {
  UPDATE_EVENT,
  DELETE_EVENT,
  CREATE_EVENT,
  FETCH_EVENTS,
  FETCH_USER_EVENTS
} from "./eventConstants";

const initialState = {
  theEvents: [],
  theUserEvents: []
};

const createEvent = (state, payload) => {
  return [...state, payload.event];
};

const updateEvent = (state, payload) => {
  return [
    ...state.filter(event => event.id !== payload.event.id),
    payload.event
  ];
};

const deleteEvent = (state, payload) => {
  return [...state.filter(event => event.id !== payload.eventId)];
};

const fetchEvents = (state, payload) => {
  return {
    ...state,
    theEvents: payload.events
  };
};

const fetchUserEvents = (state, payload) => {
  return {
    ...state,
    theUserEvents: payload.userEvents
  };
};

export default createReducer(initialState, {
  [CREATE_EVENT]: createEvent,
  [UPDATE_EVENT]: updateEvent,
  [DELETE_EVENT]: deleteEvent,
  [FETCH_EVENTS]: fetchEvents,
  [FETCH_USER_EVENTS]: fetchUserEvents
});
