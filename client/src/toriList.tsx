import React from "react";
import styled from "styled-components";
import { DateTime } from "luxon";
import { gql, useQuery } from "@apollo/client";

import allToriItemsQuery from "./allToriItems.graphql";

const ItemEntry = styled.div`
  display: flex;
  margin: 30px;
`;

const ItemDescription = styled.div`
  margin: 10px;
`;

const ItemTitle = styled.div`
  font-size: 18px;
`;

const ItemDetailLine = styled.div`
  font-size: 14px;
`;

interface ToriItem {
  title: string;
  priceEuroCents: number;
  postedAt: string;
}

interface ToriFetchResult {
  allToriItems: ToriItem[];
}

const ToriList = () => {
  const toriItems = useQuery<ToriFetchResult>(gql(allToriItemsQuery));
  console.log("toriItems", toriItems);

  if (!toriItems.loading) {
    const items = toriItems.data!.allToriItems.map((t) => (
      <ItemEntry key={t.title}>
        {/* eslint-disable-next-line max-len */}
        <img src="https://images.tori.fi/api/v1/imagestori/images/1688093732.jpg?rule=adwatches" />
        <ItemDescription>
          <ItemTitle>{t.title}</ItemTitle>
          <ItemDetailLine>{t.priceEuroCents / 100} €</ItemDetailLine>
          <ItemDetailLine>
            {DateTime.fromISO(t.postedAt).toLocaleString(DateTime.DATETIME_MED)}
          </ItemDetailLine>
        </ItemDescription>
      </ItemEntry>
    ));

    return <div>{items}</div>;
  } else {
    return <div>loading</div>;
  }
};

export default ToriList;
