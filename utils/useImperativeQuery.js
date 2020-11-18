import { useQuery } from "@apollo/client";

// hook to make queries like mutation calls so we don't have to re-render
export default function useImperativeQuery(query) {
  const { refetch } = useQuery(query, { skip: true });

  const imperativelyCallQuery = (variables) => {
    return refetch(variables);
  };

  return imperativelyCallQuery;
}
