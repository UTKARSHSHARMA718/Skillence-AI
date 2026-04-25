'use client'

import { useState } from "react";

const useSessionForm = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  return { pagination, setPagination };
};

export default useSessionForm;
