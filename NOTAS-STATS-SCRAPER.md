# Pendientes para `supermarket-stats` y `supermarket-scraper`

Hallazgos de revisar `supermarket-stats/internal/stats/calculator.go` mientras se diseñaba el frontend.
El front trabaja con lo que hay hoy; esto es para decidir después dónde arreglarlo.

## Fórmulas confirmadas (sin cambios)

- `price_diff_mean_N` = último `bulk_price` registrado − media de los últimos N días (ventana incluye hoy).
- `price_diff_mean_pct_N` = diff / media × 100. Positivo = por encima de su media.
- Todo sobre `bulk_price` (€/kg·L). La media es por registro, no ponderada por tiempo.
- Ventanas: 7, 30, 90 y **356** días (+ `all`). El front rotula «1 año» para 356 d.

## Posibles mejoras

### stats
1. **Sin recuento de registros por ventana.** Solo hay `num_changes_*`. El front no puede aplicar «pocos registros» → añadir `count_*` (nº de observaciones en la ventana).
2. **Un precio inválido anula todo el producto.** `return r` dentro del bucle de validación devuelve estadísticas vacías si UNA fila tiene `bulk_price` nulo/≤0 o fecha mala. Mejor: descartar esa fila y seguir.
3. **Mínimo/máximo con empates** usan `<=`/`>=` → la fecha guardada es la **más reciente** con ese precio, no la primera. Y un producto que nunca varió es a la vez mínimo y máximo (`min == max`). El front solo muestra «mínimo histórico» si `min < max`.
4. **Ventanas sin datos** dejan los campos sin rellenar (sobre todo `d7`). El front debe tolerar nulos.
5. Media no ponderada por tiempo: con muestreo irregular o huecos sesga la media. Valorar ponderar por días.
6. `price_diff_mean_*` usa el último precio aunque sea antiguo (producto no disponible hace semanas).

### scraper / datos
7. **`bulk_price` y `unit_price` intercambiados** en algunos productos de Consum (bacalao 5 kg: 13,75 → 68,75 = precio del envase). Corregir en origen o detectar (salto ×cantidad) antes de calcular; hoy genera el +235 % y cambios falsos en «Más cambios».
8. `prices.date` es texto: validar `YYYY-MM-DD` al guardar.
9. `unit_price`/`current_price` en `products` tienen los nombres cruzados respecto a su significado (artículo vs €/kg·L). Renombrar o documentar; el servidor del front los traducirá.
