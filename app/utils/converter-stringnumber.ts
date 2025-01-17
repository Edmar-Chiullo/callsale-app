
const formatCurrency = (value: number, decimalPlaces: number = 2): string => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

// const number1 = 55000.12;
// const number2 = 550234.5;

// console.log(formatCurrency(number1)); // "55.000,12"
// console.log(formatCurrency(number2, 3)); // "550.234,500"

/**
 * Converte uma string de valor monetário (ex: "R$ 55,90") para um número.
 * @param value A string com o valor monetário.
 * @returns O valor numérico convertido, ou `null` se a conversão falhar.
 */
export function convertCurrencyToNumber(value: string | null): number | null {
    if (!value) return null;
  
    // Remove a parte "R$", espaços e vírgula, substituindo pela ponto para manter o formato numérico
    const cleanedValue = value.replace("R$", "").replace(/\s+/g, "").replace(",", ".");
  
    const result = parseFloat(cleanedValue);

    //const decimal = formatCurrency(result)
  
    return isNaN(result) ? null : result;
  }
  