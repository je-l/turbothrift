import React from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";

const ItemEntry = styled.div`
  display: flex;
  margin: 5px 0;
`;

const ItemDescription = styled.div`
  margin: 10px 0;
`;

const ItemTitle = styled.div`
  font-size: 18px;
`;

const ItemUrl = styled.div`
  font-size: 14px;
`;

interface ToriItem {
  id: string;
  title: string;
  url: string;
}

interface ToriFetchResult {
  user: { searchQueries: ToriItem[] };
}

export const FETCH_TORI_QUERIES = gql`
  query {
    user {
      searchQueries {
        id
        title
        url
      }
    }
  }
`;

const ToriList = () => {
  const { loading, data } = useQuery<ToriFetchResult>(FETCH_TORI_QUERIES);

  if (!loading) {
    const items = data!.user.searchQueries.map((t) => (
      <ItemEntry key={t.id}>
        <ItemDescription>
          <ItemTitle>{t.title}</ItemTitle>
          <ItemUrl>{t.url}</ItemUrl>
        </ItemDescription>
      </ItemEntry>
    ));

    return <div>{items}</div>;
  } else {
    return <div>loading</div>;
  }
};

export default ToriList;
