# interferencias



<!-- PAGE 1 -->

# INTERFERENCIA DE ONDAS

Christian Huygens (14 de abril de 1629-8 de julio de 1695)

[Gráfico de ondas circulares concéntricas emanando de dos puntos, superponiéndose y creando un patrón de interferencia en una pizarra.]
[Ilustración de Christian Huygens, un hombre con cabello rizado y una vestimenta de época (abrigo marrón, camisa azul claro, pantalones marrones y zapatos marrones).]

---


<!-- PAGE 2 -->

**Interferencia de Ondas:** Una característica muy importante del movimiento ondulatorio es el fenómeno de interferencia. Este ocurre cuando dos o más movimientos ondulatorios coinciden en el espacio y el tiempo.

Consideremos dos fuentes puntuales F1 y F2 que oscilan en fase con la misma frecuencia angular $\omega$ y longitud de onda $\lambda$, con amplitudes A1 y A2. Sus ondas esféricas respectivas son entonces:

$\psi_1(r,t) = A_1 \cdot sen(\omega \cdot t - k \cdot r_1)$
$\psi_2(r,t) = A_2 \cdot sen(\omega \cdot t - k \cdot r_2)$

Donde r1 y r2 son las distancias desde cualquier punto a F1 y F2, respectivamente. Obsérvese que aunque las dos fuentes son idénticas, no producen la misma amplitud en P si r1 y r2 son diferentes, porque la amplitud de una onda esférica disminuye según la ley: 1/r.

[Gráfico de dos fuentes puntuales F1 y F2 emitiendo ondas concéntricas que se superponen. Un punto P está marcado, y líneas rectas r1 y r2 conectan P con F1 y F2 respectivamente.]

Supongamos que $\psi$ es una cantidad escalar, tal como una perturbación de la presión. Si $\psi$ corresponde a una cantidad vectorial, supondremos que $\psi_1$ y $\psi_2$ tienen la misma dirección de modo que la combinación de las dos ondas puede ser tratada escalarmente.

---


<!-- PAGE 3 -->

La situación descrita es tal, que en cada punto del espacio, el movimiento ondulatorio resultante
$\Psi_R = \Psi_1 + \Psi_2$
tiene una amplitud resultante dada por:
$A_R = \sqrt{A_1^2 + A_2^2 + 2 \cdot A_1 \cdot A_2 \cdot \cos[k(r_1 - r_2)]}$

La función de onda resultante es:
$\Psi_R(r,t) = A_R \cdot \text{sen}(\omega \cdot t - \alpha)$

Donde $\alpha$ es el ángulo de fase resultante dado por:
$\tan \alpha = \frac{A_1 \cdot \text{sen}(k \cdot r_1) + A_2 \cdot \text{sen}(k \cdot r_2)}{A_1 \cdot \cos(k \cdot r_1) + A_2 \cdot \cos(k \cdot r_2)}$

Por consiguiente, el resultado de la interferencia de un movimiento ondulatorio no tiene la apariencia de un movimiento ondulatorio progresivo, sino una situación estacionaria en el cual el movimiento tiene una amplitud fija en cada punto del espacio. La razón de esto es que las dos fuentes oscilan con la misma frecuencia y mantienen un desfase constante, y por lo tanto se dice que son **coherentes**. Pero si las fuentes no son de la misma frecuencia, o si sus desfases cambian erráticamente con el tiempo, no se observa el diagrama de interferencia estacionario, y las fuentes se dice que son **incoherentes**.

La ecuación de la amplitud resultante muestra que la amplitud está comprendida entre los valores $A_1 + A_2$ y $A_1 - A_2$, dependiendo de que sea:

---


<!-- PAGE 4 -->

Aquí tienes la transcripción exacta del contenido de la página del cuaderno:

```markdown
$cos k(r_1 - r_2) = \begin{cases} +1 \\ -1 \end{cases}$

El **desfase** entre los dos movimientos ondulatorios se define:

$\delta = k(r_1 - r_2)$

Concluimos que:

$\delta = k(r_1 - r_2) = \begin{cases} 2 \cdot n \cdot \pi \text{ interferencia constructiva.} \\ (2 \cdot n + 1) \pi \text{ interferencia destructiva.} \end{cases}$

siendo $n$ un número entero.

Se tiene máximo refuerzo de los dos movimientos ondulatorios, o **interferencia constructiva** si: $\delta = 2n\pi$ y máxima atenuación, o **interferencia destructiva** si $\delta = (2n+1)\pi$.
---
Puesto que el número de onda angular viene dado por: $k = 2\pi/\lambda$.

Podemos escribir:

$\delta = \frac{2\pi}{\lambda}(r_1 - r_2)$

$\delta = \frac{2\pi}{\lambda}(r_1 - r_2) = \begin{cases} \text{interferencia constructiva: } 2 \cdot n \cdot \cancel{\pi} \\ \text{interferencia destructiva: } (2 \cdot n + 1) \cancel{\pi} \end{cases}$

Simplificando:

$|r_1 - r_2| = \begin{cases} n \cdot \lambda \quad \text{interferencia constructiva.} \\ (2 \cdot n + 1) \frac{\lambda}{2} \quad \text{interferencia destructiva.} \end{cases}$

$n = 0,1,2,3,4, \dots$
```

---


<!-- PAGE 5 -->


[Error en transcripción de página]


---


<!-- PAGE 6 -->

[Gráfico de interferencia de ondas con dos fuentes (F1 y F2) creando patrones circulares y líneas hiperbólicas azules que representan la interferencia constructiva.]

Hipérbolas de interferencia constructiva:
$|r_1 - r_2| = n \cdot \lambda = 0, 1 \cdot \lambda, 2 \cdot \lambda, 3 \cdot \lambda, \dots$

[Gráfico de interferencia de ondas con dos fuentes (F1 y F2) creando patrones circulares y líneas hiperbólicas azules que representan la interferencia destructiva.]

Hipérbolas de interferencia destructiva:
$|r_1 - r_2| = (2 \cdot n + 1)\lambda / 2 = \lambda / 2, 3\lambda / 2, 5\lambda / 2, \dots$

---


<!-- PAGE 7 -->

**Ejemplo:** Dos bocinas idénticas se activan en fase mediante un oscilador común a 800 Hz y se enfrentan mutuamente a una distancia de 1,25 m. Ubique los puntos a lo largo de la línea que une las dos bocinas donde se esperarían mínimos relativos de amplitud de presión sonora. (Use v = 343 m/s)

**Solución:** La longitud de onda es:
$\lambda = \frac{v}{f} = \frac{343 \ m/s}{800 \ Hz} = 0,429 \ m$

Los mínimos relativos ocurren en aquellos puntos donde:
$|r_1 - r_2| = (2 \cdot n + 1) \lambda / 2 = \pm \lambda / 2, \pm 3 \lambda / 2, \pm 5 \lambda / 2, \dots$

Supongamos que el origen de coordenadas coincide con la bocina izquierda. Consideremos primero aquellos puntos mínimos con $x < d/2$ como se muestra en la figura siguiente:

[Gráfico de un sistema de coordenadas X-Y. En el eje X, se encuentran dos puntos F1 y F2, que representan las fuentes. F1 está en el origen (0,0). F2 está a una distancia $d = 1,25 \ m$ de F1. Un punto P se ubica en el eje X entre F1 y F2. La distancia de F1 a P se denota como $x$, y la distancia de P a F2 se denota como $r_2$. La distancia de F1 a P también se denota como $r_1$. Varias curvas (hipérbolas) se extienden desde las fuentes, representando líneas de interferencia.]

En la figura anterior, se observa que:
$r_1 = \overline{F_1 P} = x$
$r_2 = \overline{F_2 P} = d - x$

---


<!-- PAGE 8 -->

Como $r_1 < r_2$ la condición de interferencia destructiva es:
$|r_1 - r_2| = r_2 - r_1 = (d - x) - x = d - 2 \cdot x$
$d - 2 \cdot x = (2 \cdot n + 1)\lambda / 2$

Despejando x:
$x = \frac{d}{2} - (2 \cdot n + 1) \frac{\lambda}{4}$

Con: $d = 1,25 \ m, \lambda = 0,429 \ m$
y la condición: $0 < x < d/2$, obtenemos:
$x_0 = 0,518 \ m$
$x_1 = 0,303 \ m$
$x_2 = 0,089 \ m$

Consideremos ahora aquellos puntos mínimos tal que $x > d/2$ tal como se ilustra en la figura:

[Gráfico de un sistema de coordenadas cartesianas X-Y. En el eje X se encuentran dos focos F1 y F2. Un punto P está entre F1 y F2. Se indican las distancias $r_1$ (de F1 a P), $r_2$ (de P a F2), $x$ (de F1 a P), y $d$ (distancia entre F1 y F2). El valor de $d = 1,25 \ m$ está etiquetado. Varias curvas hiperbólicas se dibujan, representando líneas de interferencia.]

En la figura anterior se observa al igual que en el caso anterior que:
$r_1 = F_1 P = x$
$r_2 = F_2 P = d - x$

---


<!-- PAGE 9 -->

Como $r_1 > r_2$ la condición de interferencia destructiva es:
$$|r_1 - r_2| = r_1 - r_2 = x - (d - x) = 2 \cdot x - d$$
$$2 \cdot x - d = (2 \cdot n + 1)\lambda/2$$
Despejando x:
$$x = \frac{d}{2} + (2 \cdot n + 1)\frac{\lambda}{4}$$
Con: $d = 1,25 \ m, \lambda = 0,429 \ m$
y la condición: $d/2 < x < d$, obtenemos:
$x_0 = 0,732 \ m$
$x_1 = 0,947 \ m$
$x_2 = 1,161 \ m$
En conclusión, las posiciones entre las dos bocinas donde existen mínimos en la intensidad sonora son los puntos:

$x_0 = 0,518 \ m$
$x_1 = 0,303 \ m$
$x_2 = 0,089 \ m$
Interferencia constructiva

$x'_0 = 0,732 \ m$
$x'_1 = 0,947 \ m$
$x'_2 = 1,161 \ m$
Interferencia destructiva

Demostraremos a continuación las ecuaciones vistas de interferencia.
Si en un punto P cualquiera inciden dos ondas $\psi_1$ y $\psi_2$ provenientes de los focos F1 y F2::
$$\psi_1(r,t) = A_1 \cdot sen(\omega \cdot t - k \cdot r_1)$$
$$\psi_2(r,t) = A_2 \cdot sen(\omega \cdot t - k \cdot r_2)$$
Supongamos que la onda resultante: $\psi_R = \psi_1 + \psi_2$ en un punto P pueda ser escrita como una onda armónica:
$$\psi_R(r,t) = A_R \cdot sen(\omega \cdot t - \alpha)$$

---


<!-- PAGE 10 -->

Entonces:
$A_1 \cdot sen(\omega \cdot t - k \cdot r_1) + A_2 \cdot sen(\omega \cdot t - k \cdot r_2) = A_R \cdot sen(\omega \cdot t - \alpha)$

Utilizando la identidad:
$sen(\alpha - \beta) = sen(\alpha) \cdot cos(\beta) - cos(\alpha) \cdot sen(\beta)$

Se obtiene:
$A_1[sen(\omega \cdot t) \cdot cos(k \cdot r_1) - cos(\omega \cdot t) \cdot sen(k \cdot r_1)] + A_2[sen(\omega \cdot t) \cdot cos(k \cdot r_2) - cos(\omega \cdot t) \cdot sen(k \cdot r_2)] = A_R \cdot sen(\omega \cdot t - \alpha)$

De modo que:
$[A_1 \cdot cos(k \cdot r_1) + A_2 \cdot cos(k \cdot r_2)]sen(\omega \cdot t) - [A_1 \cdot sen(k \cdot r_1) + A_2 \cdot sen(k \cdot r_2)]cos(\omega \cdot t) = A_R \cdot cos\alpha \cdot sen(\omega \cdot t) - A_R \cdot sen\alpha \cdot cos(\omega \cdot t)$

La independencia lineal del seno y del coseno obliga a que:
$A_R \cdot sen\alpha = A_1 \cdot sen(k \cdot r_1) + A_2 \cdot sen(k \cdot r_2)$
$A_R \cdot cos\alpha = A_1 \cdot cos(k \cdot r_1) + A_2 \cdot cos(k \cdot r_2)$

Dividiendo estas dos ecuaciones se obtiene la ecuación:
$$tan \alpha = \frac{A_1 \cdot sen(k \cdot r_1) + A_2 \cdot sen(k \cdot r_2)}{A_1 \cdot cos(k \cdot r_1) + A_2 \cdot cos(k \cdot r_2)}$$

Si elevamos al cuadrado cada una de las ecuaciones anteriores:
$A_R^2 \cdot sen^2\alpha = A_1^2 \cdot sen^2(k \cdot r_1) + 2 \cdot A_1 \cdot A_2 \cdot sen(k \cdot r_1) \cdot sen(k \cdot r_2) + A_2^2 \cdot sen^2(k \cdot r_2)$

---


<!-- PAGE 11 -->

Aquí está la transcripción exacta del contenido de la página:

$A_R^2 \cdot \cos^2 \alpha = A_1^2 \cdot \cos^2 (k \cdot r_1) +$
$2 \cdot A_1 \cdot A_2 \cdot \cos (k \cdot r_1) \cdot \cos (k \cdot r_2) +$
$A_2^2 \cdot \cos^2 (k \cdot r_2)$

Sumando y factorizando:
$A_R^2 (\operatorname{sen}^2 \alpha + \cos^2 \alpha) =$
$A_1^2 [\operatorname{sen}^2 (k \cdot r_1) + \cos^2 (k \cdot r_1)] +$
$2 \cdot A_1 \cdot A_2 [\cos (k \cdot r_1) \cdot \cos (k \cdot r_2)$
$+ \operatorname{sen} (k \cdot r_1) \cdot \operatorname{sen} (k \cdot r_2)] +$
$A_2^2 [\operatorname{sen}^2 (k \cdot r_2) + \cos^2 (k \cdot r_2)]$

Utilizando las identidades:
$\operatorname{sen}^2 \theta + \cos^2 \theta = 1$
$\cos(\alpha - \beta) = \cos(\alpha) \cdot \cos(\beta) - \operatorname{sen}(\alpha) \cdot \operatorname{sen}(\beta)$

Se obtiene:
$A_R^2 = A_1^2 + A_2^2 + 2 \cdot A_1 \cdot A_2 \cdot \cos[k(r_1 - r_2)]$

Extrayendo la raíz cuadrada se obtiene la ecuación:
$A_R = \sqrt{A_1^2 + A_2^2 + 2 \cdot A_1 \cdot A_2 \cdot \cos \delta}$

Siendo $\delta$ desfase entre los dos movimientos ondulatorios:
$\delta = k(r_1 - r_2)$

[Gráfico de un personaje de caricatura similar a Albert Einstein, con bata de laboratorio, sosteniendo un lápiz.]

---
