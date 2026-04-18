export const formatRupiah = (n: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n)

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
  }).format(n)