/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {

	this.gs = gs;
	this.cartas = ['8-ball','potato','dinosaur','kronos','rocket','unicorn','guy','zeppelin'];
	this.encontradas = 0;
	this.estado = 'ini';
	this.mensaje = "Memory Game";
	this.cards = [];
	this.count = 0;
	this.firstId = 0;
	this.bool_msg = null;

	/**Inicializa el juego creando las cartas (recuerda que son 2 de
	cada tipo de carta), desordenándolas y comenzando el bucle de juego.
	*/
	this.initGame = function(){
		

		
		for(var x = 0; x < 8; x++){
			this.cards[2*x] = new MemoryGameCard(this.cartas[x]);
			this.cards[2*x + 1] = new MemoryGameCard(this.cartas[x]);
		}
		
		this.cards.sort(function() {return Math.random()-0.5});

		this.loop();

	};

	/**Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual
	del juego y (2) pide a cada una de las cartas del tablero que se dibujen
	*/
	this.draw = function(){
		if ( this.bool_msg == true){
			this.mensaje = "Match found!!";
		}else if (this.bool_msg == false){
			this.mensaje = "Try again";
		}

		if(this.encontradas == 8)
			this.mensaje = "You win !!!";
		
		this.gs.drawMessage(this.mensaje);

		for( var i = 0; i < 16; i++){		
			this.cards[i].draw(this.gs,i);
		}
	}

	/*Es el bucle del juego. En este caso es muy sencillo: llamamos al
	método draw cada 16ms (equivalente a unos 60fps). Esto se realizará con
	la función setInterval de Javascript
	*/
	this.loop = function(){
	
			setInterval(this.draw(),16);

	};
	
		/*: Este método se llama cada vez que el jugador pulsa
	sobre alguna de las cartas (identificada por el número que ocupan en el
	array de cartas del juego). Es el responsable de voltear la carta y, si hay
	dos volteadas, comprobar si son la misma (en cuyo caso las marcará como
	encontradas). En caso de no ser la misma las volverá a poner boca abajo1
	.*/
	this.onClick = function(cardId){

			if(this.cards[cardId].state == "abajo"){
				if( this.count == 0 ){
					 this.cards[cardId].flip();
					 this.firstId = cardId;
					 this.count++;
					
				}
				else {
						this.cards[cardId].flip();
					
						if(this.cards[this.firstId].compareTo(this.cards[cardId])){
							this.cards[this.firstId].found();
							this.cards[cardId].found();
							this.encontradas++;
							this.bool_msg = true;
							
						}else{
							this.cards[this.firstId].state = "abajo";
							this.cards[cardId].state = "abajo";
							this.bool_msg = false;
							//setTimeout(function(){ myWindow.close() }, 1000);
						}

						this.count = 0;

						console.log(this.cards[this.firstId]);
						console.log(this.cards[cardId]);
						console.log(this.bool_msg);
					
				}

			}
	};
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {
	this.card = id;
	this.state = "abajo";

	/* Da la vuelta a la carta, cambiando el estado de la misma*/
	this.flip = function(){
		this.state = "boca arriba"; 
	};

	/* Marca una carta como encontrada, cambiando el estado de la
	misma.*/
	this.found = function(){
		this.state = "encontrada";
	};

	/*Compara dos cartas, devolviendo true si ambas representan la misma carta.*/
	this.compareTo = function(otherCard){
		return (this.card === otherCard.card);
	};

	/* Dibuja la carta de acuerdo al estado en el que se encuentra.
	Recibe como parámetros el servidor gráfico y la posición en la que se
	encuentra en el array de cartas del juego (necesario para dibujar una
	carta).*/
	this.draw = function(gs,pos){
		this.gs = gs;

		if(this.state == "abajo")
			gs.draw("back",pos);
		else 
			gs.draw(this.card,pos);
	};
};
