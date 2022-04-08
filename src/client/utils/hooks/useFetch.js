import { useState, useEffect } from "react";

export function useFetch(url) {
  const [pending, setPending] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setPending(true);
    setError(false);
    const controller = new AbortController();
    const { signal } = controller;

    fetch(url, {
      signal
    })
      .then(res => res.json())
      .then(res => {
        setData(res);
        setPending(false);
      })
      .catch(e => {
        if (e instanceof DOMException && e.code === DOMException.ABORT_ERR) {
          // cleanup func was called, no op
          return;
        }
        setError(e);
      });

    return () => controller.abort();
  }, [url]);

  return [pending, data, error];
}
