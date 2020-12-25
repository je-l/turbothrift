import React from "react";
import styled from "styled-components";
import { DateTime } from "luxon";
import { gql, useQuery } from "@apollo/client";

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
  url: string;
}

interface ToriFetchResult {
  allToriQueries: ToriItem[];
}

const ToriList = () => {
  const toriItems = useQuery<ToriFetchResult>(gql`
    query {
      allToriQueries {
        title
        url
      }
    }
  `);
  console.log("toriItems", toriItems);

  if (!toriItems.loading) {
    const items = toriItems.data!.allToriQueries.map((t) => (
      <ItemEntry key={t.title}>
        <ItemDescription>
          <ItemTitle>{t.title}</ItemTitle>
          <ItemTitle>{t.url}</ItemTitle>
        </ItemDescription>
      </ItemEntry>
    ));

    return <div>{items}</div>;
  } else {
    return <div>loading</div>;
  }
};

export default ToriList;
