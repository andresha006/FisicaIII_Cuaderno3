#  Ondas Estacionarias



<!-- PAGE 1 -->

# ONDAS ESTACIONARIAS

Christian Huygens (14 de abril de 1629-8 de julio de 1695)

[Gráfico de una onda sinusoidal o similar, con una línea azul superpuesta sobre una línea gris ligeramente desplazada, creando un efecto de doble onda o vibración.]

---


<!-- PAGE 2 -->

**Ondas Estacionarias:** Consideremos la situación en que una cuerda tiene un extremo fijo, como se indica en la figura, donde el extremo O es el punto fijo. Una onda transversal incidente moviéndose hacia la izquierda y de ecuación:

$y_1(x,t) = A_1 \cdot sen(\omega \cdot t + k \cdot x)$

se refleja en O, originando una nueva onda que se propaga hacia la derecha y que tiene por ecuación:

$y_2(x,t) = A_2 \cdot sen(\omega \cdot t - k \cdot x)$

El desplazamiento en cualquier punto de la cuerda es el resultado de la interferencia o superposición de estas dos ondas, esto es:

$y_R(x,t) = A_1 \cdot sen(\omega \cdot t + k \cdot x) + A_2 \cdot sen(\omega \cdot t - k \cdot x)$

En el punto O, tenemos $x = 0$, de modo que:

[Gráfico de dos ondas sinusoidales superpuestas en un eje XY. El eje Y tiene una pared fija en el origen O. Una onda incidente (azul punteada) se mueve hacia la izquierda, y una onda reflejada (verde punteada) se mueve hacia la derecha. Se indica una distancia $\lambda/2$ desde el origen.]

$y_R(0,t) = A_1 \cdot sen(\omega \cdot t) + A_2 \cdot sen(\omega \cdot t) = 0$

Factorizando:

$y_R(0,t) = (A_1 + A_2)sen(\omega \cdot t) = 0$

Se concluye que:

$A_1 + A_2 = 0$

O bien:

---


<!-- PAGE 3 -->

$A_1 = -A_2$

En otras palabras, la onda experimenta un cambio de fase de $\pi$ cuando se refleja en el extremo fijo.

Entonces la onda resultante se convierte en:
$y_R(x,t) = A_1 \cdot sen(\omega \cdot t + k \cdot x) + A_2 \cdot sen(\omega \cdot t - k \cdot x)$
$y_R(x,t) = A_1 \cdot sen(\omega \cdot t + k \cdot x) - A_1 \cdot sen(\omega \cdot t - k \cdot x)$

Factorizando:
$y_R(x,t) = A_1[sen(\omega \cdot t + k \cdot x) - sen(\omega \cdot t - k \cdot x)]$

Utilizando las identidades:
$sen(\alpha + \beta) = sen(\alpha) \cdot cos(\beta) + cos(\alpha) \cdot sen(\beta)$
$sen(\alpha - \beta) = sen(\alpha) \cdot cos(\beta) - cos(\alpha) \cdot sen(\beta)$

Nos queda:
$$
y_R(x,t) = A_1 \left[ \begin{aligned} & sen(\omega \cdot t) \cdot cos(k \cdot x) \\ & + cos(\omega \cdot t) \cdot sen(k \cdot x) \\ & - sen(\omega \cdot t) \cdot cos(k \cdot x) \\ & + cos(\omega \cdot t) \cdot sen(k \cdot x) \end{aligned} \right]
$$

Simplificando:
$y_R(x,t) = 2 \cdot A_1 \cdot sen(k \cdot x) \cdot cos(\omega \cdot t)$

Las expresiones $\omega t \pm k.x$ no aparecen más y la ecuación anterior no representa una onda viajera.

Efectivamente esta última expresión representa un movimiento armónico simple cuya amplitud varía de punto a punto y está dada por:
$A_R(x,t) = 2 \cdot A_1 \cdot sen(k \cdot x)$

---


<!-- PAGE 4 -->

La amplitud es cero para:
$k·x = n·\pi$
donde n es un número entero.
Puesto que $k = 2\pi / \lambda$, el resultado anterior, también se puede escribir en la forma:
$(\frac{2\pi}{\lambda})x = n·\pi$
Simplificando y despejando x:
$$x = \frac{n·\lambda}{2}$$
Estos puntos se llaman **nodos**. Los nodos sucesivos están separados por una distancia de $\lambda/2$.
Supongamos ahora que imponemos una segunda condición: que el punto x = L, que es el otro extremo de la cuerda, sea también fijo.

[Gráfico de una onda incidente (azul punteada) y una onda reflejada (verde punteada) superpuestas en un eje X-Y. El eje Y tiene una pared vertical a la izquierda. Se muestran nodos en el eje X y se indica una distancia de $\lambda/2$ entre el origen y el primer nodo.]

Esto significa que x = L, es un nodo y debe satisfacer la condición k·L = n·π. Entonces:
$k·L = n·\pi$
$(\frac{2\pi}{\lambda})L = n·\pi$
$$\lambda = \frac{2·L}{n} \quad n=1,2,3,4,...$$

---


<!-- PAGE 5 -->

Esta condición limita automáticamente las longitudes de onda de las ondas que se pueden propagar en la cuerda:

$\lambda = \frac{2 \cdot L}{n} = \frac{2 \cdot L}{1}, \frac{2 \cdot L}{2}, \frac{2 \cdot L}{3}, \frac{2 \cdot L}{4}, \dots$

[Gráfico de ondas estacionarias en una cuerda, mostrando los modos n=1, n=2 y n=3. Para n=1, se muestra $L = \frac{\lambda}{2}$. Para n=2, se muestra $L = \lambda$. Para n=3, se muestra $L = \frac{3\lambda}{2}$. Los puntos de los nodos están marcados con círculos.]

[Dibujo de una guitarra con una mano tocando las cuerdas. Una línea punteada indica la "65 cm - longitud de escala".]

$L(cm) = 65.0$
$\lambda(cm) = \frac{2 \cdot L}{n} = 130.0$
$f(Hz) = \frac{n \cdot v}{2 \cdot L} = 325.4$

[Pequeña tabla al lado de la guitarra con los encabezados 'n' y 'v (m/s)'. Debajo de 'n' hay un '1'. Debajo de 'v (m/s)' hay un '423'.]

---

Si tenemos en cuenta que la velocidad de propagación de la onda puede escribirse como:

$v = \lambda \cdot f$

vemos que también están limitadas las frecuencias de oscilación a los valores:

$f_n = \frac{v}{\lambda}$

$f_n = \frac{n \cdot v}{2 \cdot L}$
$n=1,2,3,4,\dots$

El valor:

$f_1 = \frac{v}{2 \cdot L}$

se llama frecuencia fundamental.

En general:

$f_n = n \cdot f_1$

---


<!-- PAGE 6 -->

De este modo las posibles frecuencias de oscilación (llamadas armónicos) son todos los múltiplos de la fundamental. Podemos decir que las frecuencias y longitudes de onda están cuantizadas, y que la cuantización es el resultado de las condiciones de contorno impuestas en ambos extremos de la cuerda.

La velocidad de propagación de una onda en una cuerda tensa está relacionada con la tensión ($F$) y la densidad lineal ($\mu = m/L$) por medio de la expresión:

$$v = \sqrt{\frac{F}{\mu}}$$

Así que la frecuencia de cualquier armónico viene dada por:

$$f_n = \frac{n}{2 \cdot L} \sqrt{\frac{F}{\mu}}$$
$$n = 1,2,3,4,...$$

Para demostrar la fórmula de la velocidad de propagación de una onda en una cuerda tensa, consideremos un pulso en forma de arco que se desplaza con velocidad $v$ hacia la derecha sobre una cuerda.

[Gráfico de un pulso de onda en una cuerda tensa, representado como un arco de círculo. Se muestran las fuerzas de tensión ($F$) en los extremos del arco, descompuestas en componentes $F_x$ y $F_y$. Los ángulos $\theta$ se indican en relación con la horizontal. Una flecha indica la dirección del pulso ('pulso') y otra flecha indica la velocidad $v$ hacia la derecha. También se muestra un elemento de longitud $\Delta s$ en la parte superior del pulso y un radio $r$ desde el centro del círculo imaginario que forma el arco.]

---


<!-- PAGE 7 -->


[Error en transcripción de página]


---


<!-- PAGE 8 -->

Para un ángulo $\theta$ muy pequeño, podemos observar que la fuerza resultante está dirigida hacia el centro de curvatura del pulso, por lo que debe ser igual a la **fuerza centrípeta**:

$$F_R = \sum F_y = 2 \cdot F \cdot \text{sen } \theta \approx 2 \cdot F \cdot \theta = \frac{\Delta m \cdot v^2}{r}$$

[Gráfico de un pulso de onda con vectores de fuerza F, Fx, Fy, y ángulos theta. Se muestra un arco de longitud $\Delta s$ y un radio $r$, con una flecha indicando la dirección del pulso.]

El ángulo $\theta$ medido en radianes se calcula dividiendo la longitud de arco (comprendido por dicho ángulo), dividido por el radio:

$$\theta = \frac{\Delta s/2}{r}$$

Dado que:

$$\Delta m = \mu \cdot \Delta s$$
$$F_R = 2 \cdot F \cdot \theta = \frac{\Delta m \cdot v^2}{r}$$
$$F_R = 2 \cdot F \left( \frac{\Delta s/2}{r} \right) = \frac{\mu \cdot \Delta s \cdot v^2}{r}$$

Simplificando:

$$F = \mu \cdot v^2$$

Despejando la velocidad:

$$v = \sqrt{\frac{F}{\mu}}$$

[Gráfico de un clip de papel con ojos sobre una hoja de papel rayada.]

---


<!-- PAGE 9 -->

Ejemplo: Una cuerda uniforme tiene una masa de 0.300 kg y una longitud de 6.00 m. La cuerda pasa sobre una polea y soporta un objeto de 2.00 kg. Encuentre la rapidez de un pulso que viaje a lo largo de esta cuerda.

[Diagrama de una cuerda horizontal de 5 m de longitud, anclada a una pared a la izquierda, que pasa sobre una polea a la derecha. De la polea cuelga un bloque de masa $m = 2 \text{ kg}$. Se indican las fuerzas: $F$ hacia arriba (tensión) y $w = m \cdot g$ hacia abajo (peso). La altura de la polea sobre la mesa es de 1 m.]

Solución: La tensión de la cuerda es igual al peso del bloque:
$F = m \cdot g = 19,6 \text{ N}$

La densidad lineal de la cuerda es:
$\mu = \frac{masa}{longitud} = \frac{0,3 \text{ kg}}{6 \text{ m}} = 0,05 \text{ kg/m}$

La velocidad de propagación de las ondas es:
$v = \sqrt{\frac{F}{\mu}}$
$v = \sqrt{\frac{19,6 \text{ N}}{0,05 \text{ kg/m}}} \approx 19,8 \text{ m/s}$

La frecuencia del fundamental (primer armónico) es:
$f_1 = \frac{v}{2 \cdot L}$
$f_1 = \frac{19,8 \text{ m/s}}{2(5 \text{ m})} = 1,98 \text{ Hz}$

---


<!-- PAGE 10 -->

```markdown
M(gr): 2000
m(gr): 300
l(m): 2
L(m): 2
n: 1

v (m/s): 11.431
$\omega$ (s⁻¹): 17.956
k (m⁻¹): 1.571
$\lambda$ (m): 4.000
f (Hz): 2.858

M = Masa del bloque
m = Masa de toda la cuerda
l = Longitud de la parte de la cuerda que oscila
L = Longitud de toda la cuerda
f = frecuencia de oscilación

[Gráfico: Simulación de una cuerda vibrante. La cuerda está fija en el extremo izquierdo (marcado '2') y pasa por una polea en el extremo derecho (marcado '0'), donde cuelga un bloque 'M'. La cuerda muestra una oscilación en su primer modo (n=1), formando un solo bucle. Debajo de la cuerda hay una barra horizontal con marcas '1' y '2'. También hay un control deslizante etiquetado 'fps'.]

[Gráfico: Ilustración de un personaje de dibujos animados similar a Albert Einstein, con cabello blanco y bigote, vestido con una bata de laboratorio y corbata, sosteniendo una tiza.]
```

---
