import { useQuery } from "@apollo/client";

export default function useImperativeQuery(query) {
  const { refetch } = useQuery(query, { skip: true });

  const imperativelyCallQuery = (variables) => {
    return refetch(variables);
  };

  return imperativelyCallQuery;
}
