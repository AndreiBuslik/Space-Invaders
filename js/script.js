const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreEl');
const c = canvas.getContext('2d'); 

canvas.width = 1024;   // O canvas terá o tamanho da tela do dispositivo
canvas.height = 576;


/*************************
* Classe para o jogador. * 
*************************/

class Player {

    constructor(){  // Construtor, inicia valores iniciais para as posições horizontal e vertical, a imagem e suas dimensões e a rotação

        this.velocity = { // Inicia as variáveis que vão modificar as posições horizontal e vertical e dar a sensação de velocidade

            x: 0,
            y: 0

        }

        this.rotation = 0; // Variável para a rotação da nave
        this.opacity = 1;

        const image = new Image();  // Constante para o objeto da imagem
        image.src = "../assets/spaceship.png"; // Indica onde a imagem está guardada
        image.onload = () => {  // Arrow function para que as dimensões da imagem sejam configuradas após o carregamento completo da imagem

            const scale = 0.15;  // Faz com que a escala da nave seja 15% do tamanho original
            this.image = image;
            this.width = image.width * scale;  // Configura a largura e altura da imagem para 15% do tamanho original
            this.height = image.height * scale;

            this.position = {  // Posiciona a nave

                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
    
            }

        }

    }

    draw(){ // Função para desenhar a nave na tela
        
        c.save(); // Salva o conteúdo da tela antes de fazer a rotação
        c.globalAlpha = this.opacity;
        /*************************************************************************** 
         * Para rotacionar a nave é preciso rotacionar o canvas inteiro a partir   *
         * do topo à esquerda. Então, devemos tirar uma 'foto' do momento anterior *
         * a rotação e usar o translate para o centro da nave.                     *
         ***************************************************************************/

        c.translate(
            
            player.position.x + player.width / 2, 
            player.position.y + player.height / 2
        
        );

        c.rotate(this.rotation);

        c.translate(
            
            - player.position.x - player.width / 2, 
            - player.position.y - player.height / 2
        
        );

        c.drawImage(
                
            this.image, 
            this.position.x,
            this.position.y, 
            this.width, 
            this.height
            
        ) // Chama a função nativa para redesenhar

        c.restore(); // Restaura o canvas com as mudanças
        
    }

    update(){ // Função que atualiza a imagem da nave

        if(this.image){ // Caso a imagem já esteja carregada
            
            this.draw();
            this.position.x += this.velocity.x;
        
        }

    }

}

/********************************************************************************
* Classe para os projéties lançados pela nave. Como serão gerados dinamicamente *
* são necessárias a posição e velocidade. Com isso, power ups podem ser criados *
* com essa ideia.                                                               *
********************************************************************************/

class Projectile{

    constructor({position, velocity}){

        this.position = position;
        this.velocity = velocity;

        this.radius = 4;  // Os projéteis serão circulares

    }

    draw(){

        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);  // Método para criar um círculo completo
        c.fillStyle = 'red';
        c.fill();
        c.closePath();
    
    }

    update(){

        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

    }

}

/******************************
* Classe para os alienígenas. *
******************************/

class Invader {

    constructor({position}){  // Construtor, inicia valores iniciais para as posições horizontal e vertical

        this.velocity = { // Inicia as variáveis que vão modificar as posições horizontal e vertical e dar a sensação de velocidade

            x: 0,
            y: 0

        }

       // this.rotation = 0; // Variável para a rotação da nave

        const image = new Image();  // Constante para o objeto da imagem
        image.src = "../assets/invader.png"; // Indica onde a imagem está guardada
        image.onload = () => {  // Arrow function para que as dimensões da imagem sejam configuradas após o carregamento completo da imagem

            const scale = 1;
            this.image = image;
            this.width = image.width * scale;  // Configura a largura e altura da imagem para 15% do tamanho original
            this.height = image.height * scale;

            this.position = {

                x: position.x,
                y: position.y
    
            }

        }

    }

    draw(){ // Função para desenhar o alienígena na tela


        c.drawImage(
                
            this.image, 
            this.position.x,
            this.position.y, 
            this.width, 
            this.height
            
        ) // Chama a função nativa para desenhar

        
    }

    update({velocity}){ // Atualiza o desenho dos alienígenas na tela

        if(this.image){ // Caso a imagem já esteja carregada
            
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        
        }

    }

    shoot(invaderProjectile){

        invaderProjectile.push(new InvaderProjectile({
            position:{

                x: this.position.x + this.width / 2,
                y: this.position.y + this.height

            },

            velocity: {

                x: 0,
                y: 5

            }

        }));

    }

}

/****************************************************************************************
* Classe para os projéties lançados pelos alienígenas. Como serão gerados dinamicamente *
* são necessárias a posição e velocidade.                                               *
****************************************************************************************/

class InvaderProjectile{

    constructor({position, velocity}){

        this.position = position;
        this.velocity = velocity;

        this.width = 3;  // Os projéteis serão retangulares
        this.height = 10;

    }

    draw(){

        c.fillStyle = 'white';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    
    }

    update(){

        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

    }

}

/**************************************************************************
* Classe para criar um grid de invasores, eles se movimentam em conjunto. *
***************************************************************************/

class Grid{

    constructor(){

        this.position = {

            x: 0,
            y: 0

        }

        this.velocity = {

            x: 3,
            y: 0

        }

        this.invaders = [];

        const rows = Math.floor(Math.random() * 5 + 2);
        const colums = Math.floor(Math.random() * 10 + 5);


        this.width = colums * 30; // A largura do grid será o número de colunas multiplicado pela largura da imagem do alienígena (30px)

        for(let x = 0 ; x < colums ; x++){ // Cria uma matriz de alienígenas

            for(let y = 0 ; y < rows ; y++){

                this.invaders.push(new Invader({
    
                    position: {
    
                        x: x * 30, // cada invasor criado é posicionado 30px a direita do anterior
                        y: y * 30
    
                    }
    
                })); //Sempre que criarmos um grid de alienígenas, criamos um array com um alienígena
                
            }

        }

    }

    update(){

        this.position.x += this.velocity.x;  // As posições horizontal e vertical são atualizadas no mesmo valor,
        this.position.y += this.velocity.x   // ????
        this.velocity.y = 0; // Garante que a cada atualização a velocidade vertical inicial do frame seja 0 para que 
                             // o grid não vá direto para o limitr inferior da tela.

        if(this.position.x + this.width >= canvas.width ||this.position.x < 0){ // Caso o grid chegue nos limites laterais da tela,

            this.velocity.x = - this.velocity.x  // inverte o sentido
            this.velocity.y = 30;                // e desce 30px.

        }
    }
    

}

/********************************************************************************
* Classe para as partículas. Partículas podem ser usadas para gerar um efeito de *
* explosão ou para o efeito de estrelas no fundo da tela *
* _______                                                               *
********************************************************************************/

class Particle{

    constructor({position, velocity, radius, color, fades}){

        this.position = position;
        this.velocity = velocity;

        this.radius = radius;  // As partículs serão circulares
        this.color = color;
        this.opacity = 1;
        this.fades = fades;
    }

    draw(){

        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);  // Método para criar um círculo completo
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }

    update(){

        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.fades){
            
            this.opacity -= 0.01;

        }
    
    }

}

const player = new Player(); // Cria um objeto para o jogador
const projectiles = []; // Cria o array de alienígenas
const grids = []; // Cria um array de grid para o conjunto de alienígenas
const invaderProjectiles = []; // Cria um array para os projéteis dos alienígenas
const particles = []; // Cria array de partículas

const keys = {  // Objeto para as teclas usadas no jogo. Inicia o estado delas como não-pressionadas

    a: {
        
        pressed: false

    },

    d: {

        pressed: false

    },

    space: {

        pressed: false

    }

}

let frames = 0; // Variável para contar os frames
let randomInterval = Math.floor(Math.random() * 500 + 500); // Gera um número inteiro, aleatório, mairo ou igual a 500
let game = {

    over: false,
    active: true
}
let score = 0;

//////
for(let i = 0 ; i < 100 ; i++){  // Laço para gerar  partículas

    particles.push(new Particle({ // Cria um objeto de uma partícula

        position: { 

            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height

        },

        velocity: { 

            x: 0,
            y: 0.3

        },

        radius: Math.random() * 2, // gera raios aleatórios para criar partículas de dimensões diferentes
        color: 'white' 

    }));

}

/*************************************************
 * Função que cria particulas para efeito de explosão da nave e dos alienígenas. *
 * 
 ********************/

function createParticles({object, color, fades}){

    for(let i = 0 ; i < 15 ; i++){  // Laço para gerar 15 partículas

        particles.push(new Particle({ // Cria um objeto de uma partícula

            position: { // indica a posição do invasor que foi atinjido

                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2

            },

            velocity: { // gera a velocidade aleatoriamente

                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2

            },

            radius: Math.random() * 3, // gera raios aleatórios para criar partículas de dimensões diferentes
            color: color || '#baa0de',
            fades: fades

        }));

    }

}

/**************************************************************************************************************
* Função recursiva para desenhar na tela tudo que deve ser atualizado de tempos em tempos. Nave, alienígena   *
* e projéteis devem ser tratados para que não fiquem invisíveis na tela por não terem carregado completamente *
* (caso da nave e do alienígena) e para não terem o efeito de ficar piscando na tela (caso dos projétis).     *
***************************************************************************************************************/

function animate(){

    if(!game.active) return;

    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    particles.forEach((particle, i) => { // Atualiza cada partícula no array de partículas

        if(particle.position.y - particle.radius >= canvas.height){

            particle.position.x = Math.random() * canvas.width;
            particle.position.y = - particle.radius;
            
        }

        if(particle.opacity <= 0){

            setTimeout(() => {

                particles.splice(i, 1);

            },0 );
        }

        else{

            particle.update();

        }

    });

    invaderProjectiles.forEach((invaderProjectile, index) => { // Para cada projétil inimigo

        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){ // verifica se ele passou da parte inferior da tela para retira-lo do array

            setTimeout(() => {// O corte no array de projéteis será após o tempo especificado. Colocando 0 garantimos um frame antes do corte 
                // e pevenimos os projéteis de ficarem piscando na tela 
  
                    invaderProjectiles.splice(index, 1);

            }, 0);

        }

        else{

            invaderProjectile.update();

        }
            // Projétil atinge o jogador
        if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y && // Caso o projétil inimigo atinja o jogador
           invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
           invaderProjectile.position.x <= player.position.x + player.width
           ){

            console.log("you lose");
            setTimeout(() => {// O corte no array de projéteis será após o tempo especificado. Colocando 0 garantimos um frame antes do corte 
                // e pevenimos os projéteis de ficarem piscando na tela 
  
                    invaderProjectiles.splice(index, 1);
                    player.opacity = 0;
                    game.over = true;

            }, 0);

            setTimeout(() => {
  
                    game.active = false;

           }, 2000);

            createParticles({

                object: player,
                color: 'white',
                fades: true
                
            });
        }

    });

    projectiles.forEach((projectile, index) => { // Para cada projétil, verificamos se ele saiu da tela. Assim o array pode ser esvaziado

        if(projectile.position.y + projectile.radius <= 0){ 
            
            setTimeout(() => {// O corte no array de projéteis será após o tempo especificado. Colocando 0 garantimos um frame antes do corte 
                              // e pevenimos os projéteis de ficarem piscando na tela 
                
                projectiles.splice(index, 1);
            
            }, 0);
        }

        else{
        
            projectile.update();
        
        }

    });

    grids.forEach((grid, gridIndex) => { // Para cada grid criado, atualiza na tela 

        grid.update();

        if(frames % 100 === 0 && grid.invaders.length > 0){

            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);

        }

        grid.invaders.forEach((invader, i) => {

            invader.update({velocity: grid.velocity});
            // Projétil atinge o inimigo
            projectiles.forEach((projectile, j) => {

                if(   
                    projectile.position.y - projectile.radius <= invader.position.y + invader.height && // Caso a posição a frente do projétil seja menor ou igual a posição a frente do invasor
                    projectile.position.x + projectile.radius >= invader.position.x &&   // ou a posição a direita do projétil seja maior ou igual a posição horizontal do invasor
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&   // ou a posição a esquerda do projétil seja menor ou igual a posição horizontal do invasor
                    projectile.position.y + projectile.radius >= invader.position.y      // ou a posição a baixo do projétil seja maior ou igual a posição vertical do invasor
                    ){

                    setTimeout(() => {

                        const invaderFound = grid.invaders.find((invader2) => invader2 === invader);  // busca o invasor
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile); // e o projétil
                        // Remove o inimigo e seu projétil
                        if(invaderFound && projectileFound){  // Caso encontre ambos na colisão, retira os dois da tela.

                            score += 100;
                            scoreEl.innerHTML = score;

                            createParticles({

                                object: invader,
                                fades: true

                            });

                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);

                            if(grid.invaders.length > 0){

                                const firstInvader = grid.invaders[0]; // Busca o invasor mais a esquerda
                                const lastInvader = grid.invaders[grid.invaders.length - 1]; // e o mais a direita para ver o número de colunas no grid

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.x = firstInvader.position.x; // Redimensiona o grid após retirar um invasor

                            }

                            else{

                                grids.splice(gridIndex, 1);

                            }
                        }

                    }, 0);

                }

            });

        });

    });

    if(keys.a.pressed && player.position.x >= 0){ // Caso a tecla de movimento para a esquerda esteja pressionada e não passou da largura da tela

        player.velocity.x = -5;    // muda sua posição para a esquerda em 5 unidades
        player.rotation = -0.15;   // e rotaciona a nave para a esquerda.

    }

    else if(keys.d.pressed && player.position.x  + player.width <= canvas.width){ // Caso a tecla de movimento para a direita esteja pressionada e não passou da largura da tela

        player.velocity.x = 5;    // muda sua posição para a direita em 5 unidades
        player.rotation = 0.15;   // e rotaciona a nave para a direita.

    }

    else {  // Caso nenhuma das duas teclas de movimento estejam pressionadas, a posição horizontal e a rotação não mudam

        player.velocity.x = 0;
        player.rotation = 0;

    }

    if(frames % randomInterval === 0){ // A cada número de frames gerados aleatoriamente, cria um novo grid de alienígenas
                               // Uma vez que 0 é divisível por qualquer valor diferente de 0, na primeira vez que a função "animate" rodar, um grid será criado
        grids.push(new Grid());
        randomInterval = Math.floor(Math.random() * 500 + 500); // Gera um novo intervalo de frame para gerar um novo grid
        frames = 0; // Reinicia o número de frames para que nas próximas iterações os valores gerados não sejam sempre menores que o anterior
    }

    frames++; 

}

animate(); // Chama a função de animação

/*******************************************************
* Evento para capturar quando uma tecla é pressionada. *
*******************************************************/

window.addEventListener('keydown', ({key}) =>{ 

    if(game.over) return;

    switch(key){

        case 'a':

            keys.a.pressed = true;
            //console.log('left');

        break;

        case 'd':

            //player.velocity.x += 5;
            keys.d.pressed = true;
            //console.log('right');
            
        break;

        case ' ':

            //console.log('shoot');

            projectiles.push(new Projectile({  // Caso a tecla "espaço" tenha sido pressionada, cria novos objetos de projéteis e insere no array
                                               // de projéteis
                    position: {
            
                        x: player.position.x + player.width / 2, // a posição de um projétil na horizontal deve ser a frente da nave
                        y: player.position.y                     // e na vertical a mesma da nave
            
                    },
            
                    velocity: { // a posição de um projétil lançado deve ser a mesma na horizontal e ir mudando na vertical
            
                        x: 0,
                        y: -15
                    }
            
                })
            );

            //console.log(projectiles);
            
        break;


    }

});


/*************************************************
* Evento para capturar quando uma tecla é solta. *
**************************************************/

window.addEventListener('keyup', ({key}) =>{

    switch(key){

        case 'a':

            keys.a.pressed = false;
           //console.log('left');

        break;

        case 'd':

            keys.d.pressed = false;
            //console.log('right');
            
        break;

        case ' ':

            //console.log('shoot');
            
        break;


    }

});