import bcrypt from "bcrypt";

const runTest = async () => {
  const result = await bcrypt.compare(
    "sandeep",
    "$2b$10$VwchzttOt/tYMdQkb/NTBu.rlq4prAyUoK/MW7tW71ZwdJRuipDgK"
  );

  console.log("Direct compare result:", result);
};

runTest();