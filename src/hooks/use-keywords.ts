import { useState } from "react";
import { useMutationData } from "./use-mutation-data";
import { onDeleteKeyword, onSaveKeyword } from "@/actions/automation";

const useKeywords = (id: string) => {
  const [keyword, setKeyword] = useState("");
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setKeyword(e.target.value);

  const {
    mutate: addKeyword,
    isPending: isPendingAdd,
    variables,
  } = useMutationData(
    ["add-keyword"],
    async (data) => {
      const { keyword, listenerId } = data as unknown as {
        keyword: string;
        listenerId?: string;
      };
      return await onSaveKeyword(id, keyword, listenerId);
    },
    ["automation-info"],
    () => setKeyword("")
  );

  const onKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    listenerId?: string
  ) => {
    if (e.key === "Enter") {
      if (keyword.trim() === "") return;
      addKeyword({ keyword, listenerId } as any);
      setKeyword("");
    }
  };

  const onClickAddKeyword = (listenerId?: string) => {
    if (keyword.trim() === "") return;
    addKeyword({ keyword, listenerId } as any);
    setKeyword("");
  };

  const { mutate: removeKeyword, isPending: isPendingDelete } = useMutationData(
    ["delete-keyword"],
    async (data) => {
      const { id } = data as unknown as { id: string };
      return await onDeleteKeyword(id);
    },
    ["automation-info"]
  );

  return {
    keyword,
    onValueChange,
    onKeyPress,
    onClickAddKeyword,
    removeKeyword,
    variables,
    isPendingAdd,
    isPendingDelete,
  };
};

export default useKeywords;
