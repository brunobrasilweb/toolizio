// Utilities for credit card number generation and Luhn algorithm

export type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'maestro' | 'unknown';

export interface CardOptions {
  network: CardNetwork;
  quantity: number;
  format: 'groups' | 'continuous';
  masked: boolean;
}

const networkPrefixes: Record<CardNetwork, string[]> = {
  visa: ['4'],
  mastercard: ['51', '52', '53', '54', '55', '2221', '2222', '2223', '2224', '2225', '2226', '2227', '2228', '2229', '223', '224', '225', '226', '227', '228', '229', '23', '24', '25', '26', '270', '271', '2720'],
  amex: ['34', '37'],
  discover: ['6011', '65', '644', '645', '646', '647', '648', '649'],
  diners: ['36', '38', '300', '301', '302', '303', '304', '305'],
  jcb: ['35'],
  maestro: ['50', '56', '57', '58', '67'],
  unknown: ['4', '5', '6', '3']
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Luhn checksum digit calculation
export function luhnComputeCheckDigit(numberWithoutCheckDigit: string): number {
  const digits = numberWithoutCheckDigit.split('').reverse().map((d) => parseInt(d, 10));
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 === 0) {
      // double every second digit (because we reversed)
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

export function luhnValidate(number: string): boolean {
  const digits = number.replace(/\D/g, '').split('').map((d) => parseInt(d, 10));
  let sum = 0;
  for (let i = digits.length - 1, j = 0; i >= 0; i--, j++) {
    let digit = digits[i];
    if (j % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export function generateCardNumberForNetwork(network: CardNetwork): string {
  const prefixes = networkPrefixes[network] || networkPrefixes.unknown;
  const prefix = prefixes[randomInt(0, prefixes.length - 1)];

  // typical lengths per network
  const length = network === 'amex' ? 15 : 16;

  let number = prefix;
  while (number.length < length - 1) {
    number += String(randomInt(0, 9));
  }

  const check = luhnComputeCheckDigit(number);
  number += String(check);
  return number;
}

export function formatCardNumber(number: string, style: 'groups' | 'continuous') {
  const clean = number.replace(/\D/g, '');
  if (style === 'continuous') return clean;
  if (clean.length === 15) {
    // amex grouping 4-6-5
    return `${clean.substr(0,4)} ${clean.substr(4,6)} ${clean.substr(10,5)}`;
  }
  // default 4-digit groups
  return clean.replace(/(.{4})/g, '$1 ').trim();
}

export function generateCards(options: CardOptions): string[] {
  const results: string[] = [];
  for (let i = 0; i < options.quantity; i++) {
    const num = generateCardNumberForNetwork(options.network);
    results.push(options.format === 'groups' ? formatCardNumber(num, 'groups') : formatCardNumber(num, 'continuous'));
  }
  return results;
}
