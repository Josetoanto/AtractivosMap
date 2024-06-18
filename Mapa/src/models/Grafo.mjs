import LinkedList from './LinkedList.mjs';
export class Grafo {
    #matrizAdyacencia = [];
    #map = new Map();
    #matrizAristas = []

    constructor() {}

    addVertices(...vertices) {
        for (let value of vertices) {
            this.#matrizAdyacencia.push(new LinkedList());
            this.#map.set(value, this.#matrizAdyacencia.length - 1);
        }
    }

    addV(value) {
        this.#matrizAdyacencia.push(new LinkedList());
        this.#map.set(value, this.#matrizAdyacencia.length - 1);
    }

    printMatrizAristas() {
        console.log("#matrizAristas:");
        for (let i = 0; i < this.#matrizAristas.length; i++) {
          if (this.#matrizAristas[i]) {
            console.log(`${Array.from(this.#map.keys())[i]}: ${this.#matrizAristas[i].join(" ")}`);
          } else {
            console.log(`${Array.from(this.#map.keys())[i]}: []`);
          }
        }
      }

    getSize(){
        return this.#matrizAdyacencia.length
    }

    addConexion(start, end, weight = 1) {
        if (this.#map.has(start) && this.#map.has(end)) {
          this.#matrizAdyacencia[this.#map.get(start)].push(end, weight);
          if (!this.#matrizAristas[this.#map.get(start)]) {
            this.#matrizAristas[this.#map.get(start)] = new Array(this.#matrizAdyacencia.length).fill(0);
          }
          if (!this.#matrizAristas[this.#map.get(end)]) {
            this.#matrizAristas[this.#map.get(end)] = new Array(this.#matrizAdyacencia.length).fill(0);
          }
          this.#matrizAristas[this.#map.get(start)][this.#map.get(end)] = weight;
          this.#matrizAristas[this.#map.get(end)][this.#map.get(start)] = weight;
          return true;
        }
        return false;
      }

    bfs(callback){
        let queue = []
        let list = []
        const entries = [...structuredClone(this.#map)];
        for (let i=0; i<this.#matrizAdyacencia.length;i++)
            list[i] = false
        
        let [key] = entries[0]
        queue.push(key)
        
        while (queue.length > 0) {
            let val = queue.shift() 
            callback(val) 
            list[this.#map.get(val)] = true 
            for (let i=0;i<this.#matrizAdyacencia[this.#map.get(val)].length;i++) {
                if (this.#matrizAdyacencia[this.#map.get(val)][i]){
                    let [key] = entries[i]
                    if (!list[this.#map.get(key)] && !queue.includes(key)) 
                        queue.push(key) 
                }
            }
        }

    }

    
    busquedaProfundidad(callback) {
      let pila = [];  
      let lista = []; 
      const entries = [...structuredClone(this.#map)]; 
      for (let i = 0; i < this.#matrizAdyacencia.length; i++)
          lista[i] = false; 
      let [indexCero] = entries[0]; 
      pila.push(indexCero); 
      while (pila.length > 0) {
          let val = pila.pop(); 
          if (!lista[this.#map.get(val)]) { 
              callback(val); 
              lista[this.#map.get(val)] = true; 
              let vecinosEncontrados = [...this.#matrizAdyacencia[this.#map.get(val)].indice()];
              for (let i = vecinosEncontrados.length - 1; i >= 0; i--) {
                  let vecino = vecinosEncontrados[i];
                  if (!lista[this.#map.get(vecino)]) 
                      pila.push(vecino); 
              }
          }
      }
  }

  dijkstra(start) {
      console.log(`Inicio de dijkstra con nodo: ${start}`);
      if (typeof start !== 'string') {
          throw new Error(`El nodo de inicio debe ser un string, pero se recibió: ${start}`);
      }
      
      const size = this.getSize(); 
      const distances = new Array(size).fill(Infinity);  
      const n = []; // Lista de nodos

      const startIndex = this.#map.get(start); 
      if (startIndex === null) {
          console.log("El nodo a buscar no existe en el mapa");
      }
      
      distances[startIndex] = 0; 
      n.push(start); 

      while (n.length > 0) {
          let currentNode = n.shift(); 
          let currentIndex = this.#map.get(currentNode); 
          if (currentIndex === null || this.#matrizAristas[currentIndex] === null) {
              console.log("Indice invalido para el nodo");
          }
          
          for (let i = 0; i < this.#matrizAristas[currentIndex].length; i++) {
              if (this.#matrizAristas[currentIndex][i] !== 0) {
                  let distance = distances[currentIndex] + this.#matrizAristas[currentIndex][i];
                  if (distance < distances[i]) { 
                      distances[i] = distance; 
                      n.push(Array.from(this.#map.keys())[i]); 
                  }
              }
          }
      }
      return { distances: distances}; 
  }

  printDijkstraResult(result, start) {
      let message = `Caminos mas cortos desde ${start}:\n\n`;
      for (let i = 0; i < result.distances.length; i++) {
          let node = Array.from(this.#map.keys())[i];
          message += `Distancia a ${node}: ${result.distances[i]}\n`; 
      }
      return message; 
  }
}

export default Grafo
