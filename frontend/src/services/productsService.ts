export const getAllProducts = async () => {
    const response = await fetch('/generated_parts.json');
    const data = await response.json();
    return data;
  };