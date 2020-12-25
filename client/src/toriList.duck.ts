import { action, ActionType } from "typesafe-actions";

const defaultState = {
  searchingToriItems: false,
  toriItems: [],
};

export const submitForm = (searchInput: string, url: string) =>
  action("SUBMIT_FORM", { searchInput, url });

const reducers = (
  state = defaultState,
  action: ActionType<typeof submitForm>
) => {
  switch (action.type) {
    case "SUBMIT_FORM":
      state.searchingToriItems = true;
      state.toriItems = [];
      return {
        ...state,
        toriItems: [],
        searchingToriItems: true,
      };
    default:
      return state;
  }
};

export default reducers;
