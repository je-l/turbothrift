import React from "react";
import { gql, useQuery } from "@apollo/client";
import allToriItemsQuery from "./allToriItems.graphql";

interface ToriItem {
  title: string;
}

interface ToriFetchResult {
  allToriItems: ToriItem[];
}

const ToriList = () => {
  const toriItems = useQuery<ToriFetchResult>(gql(allToriItemsQuery));
  console.log("toriItems", toriItems);

  if (!toriItems.loading) {
    const items = toriItems.data!.allToriItems.map((t) => (
      <div key={t.title}>
        {/* eslint-disable-next-line max-len */}
        <img src="https://images.tori.fi/api/v1/imagestori/images/1688093732.jpg?rule=adwatches" />
        {t.title}
      </div>
    ));

    return <div>{items}</div>;
  } else {
    return <div>loading</div>;
  }
};

export default ToriList;
