import { useState } from "react";
import { useMutationData } from "./use-mutation-data";
import { onDeleteKeyword, onSaveKeyword } from "@/actions/automation";

const useKeywords2 = (id: string) => {
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
      const { keyword } = data as unknown as { keyword: string };
      return await onSaveKeyword(id, keyword);
    },
    ["automation-info"],
    () => setKeyword("")
  );

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (keyword.trim() === "") return;
      addKeyword({ keyword } as any);
      setKeyword("");
    }
  };

  const onClickAddKeyword = () => {
    if (keyword.trim() === "") return;
    addKeyword({ keyword } as any);
    setKeyword("");
  };

  const { mutate: deleteMuatation, isPending: isPendingDelete } =
    useMutationData(
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
    deleteMuatation,
    variables,
    isPendingAdd,
    isPendingDelete,
  };
};

export default useKeywords2;
