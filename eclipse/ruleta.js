export default class Ruleta {
	constructor(canvasId, prizes = [], options = {}){
		this.canvas = document.getElementById(canvasId);
		if(!this.canvas) throw new Error('Canvas no encontrado: ' + canvasId);
		this.ctx = this.canvas.getContext('2d');
		this.prizes = Array.from(prizes);
		this.size = options.size || Math.min(window.innerWidth - 40, 600);
		this.onResult = options.onResult || function(){};
		this.rotation = 0; // en radianes
		this.isSpinning = false;
		this._setupCanvas();
		this._createConfettiLayer();
		this.centerImage = new Image();
		this.centerImage.src = 'images/pokeball.png';
		this.centerImage.onload = ()=> this.draw();
		this.confetti = [];
		this.confettiImages = [];
		this._loadConfettiImages([
			'images/Honor_Ball.png',
			'images/Luna_Ball.png',
			'images/Malla_Ball.png',
			'images/Master_Ball.png',
			'images/Nido_Ball.png',
			'images/Peso_Ball.png',
			'images/Poké_Ball.png',
			'images/Rapid_Ball.png',
			'images/Sana_Ball.png',
			'images/Super_Ball.png',
			'images/Ultra_Ball.png',
			'images/Veloz_Ball.png',
		]);
		this.draw();
		// Activar giro al pulsar centro
		this.canvas.addEventListener('click', (e)=>{
			const rect = this.canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const dx = x - this.center;
			const dy = y - this.center;
			if(Math.sqrt(dx*dx + dy*dy) <= 40) this.spin();
		});
		window.addEventListener('resize', ()=>{
			this._setupCanvas();
			this.draw();
		});
	}

	_setupCanvas(){
		const ratio = window.devicePixelRatio || 1;
		this.size = this.size || Math.min(window.innerWidth - 40, 600);
		const px = this.size;
		this.canvas.width = px * ratio;
		this.canvas.height = px * ratio;
		this.canvas.style.width = px + 'px';
		this.canvas.style.height = px + 'px';
		this.ctx.setTransform(ratio,0,0,ratio,0,0);
		this.center = px/2;
		this.radius = Math.floor(px/2) - 10;
		if(this.confettiCanvas) this._resizeConfettiCanvas();
	}

	_createConfettiLayer(){
		this.confettiCanvas = document.createElement('canvas');
		this.confettiCanvas.style.position = 'fixed';
		this.confettiCanvas.style.top = '0';
		this.confettiCanvas.style.left = '0';
		this.confettiCanvas.style.width = '100%';
		this.confettiCanvas.style.height = '100%';
		this.confettiCanvas.style.pointerEvents = 'none';
		this.confettiCanvas.style.zIndex = '10';
		document.body.appendChild(this.confettiCanvas);
		this.confettiCtx = this.confettiCanvas.getContext('2d');
		this._resizeConfettiCanvas();
	}

	_resizeConfettiCanvas(){
		const ratio = window.devicePixelRatio || 1;
		const w = window.innerWidth;
		const h = window.innerHeight;
		this.confettiCanvas.width = w * ratio;
		this.confettiCanvas.height = h * ratio;
		this.confettiCanvas.style.width = w + 'px';
		this.confettiCanvas.style.height = h + 'px';
		this.confettiCtx.setTransform(ratio,0,0,ratio,0,0);
	}

	setPrizes(prizes){
		this.prizes = Array.from(prizes);
		this.draw();
	}

	addPrize(p){ this.prizes.push(String(p)); this.draw(); }
	removePrize(index){ if(index>=0 && index<this.prizes.length){ this.prizes.splice(index,1); this.draw(); } }

	color(i){
		const palette = ['#DD2B61','#F1D345','#5BC6F0'];
		return palette[i % palette.length];
	}

	draw(){
		const ctx = this.ctx;
		const w = this.canvas.width / (window.devicePixelRatio || 1);
		const h = this.canvas.height / (window.devicePixelRatio || 1);
		ctx.clearRect(0,0,w,h);
		const len = Math.max(1, this.prizes.length);
		const angle = (Math.PI*2) / len;

		for(let i=0;i<len;i++){
			const start = this.rotation + i*angle;
			const end = start + angle;
			ctx.beginPath();
			ctx.moveTo(this.center,this.center);
			ctx.arc(this.center,this.center,this.radius,start,end);
			ctx.closePath();
			ctx.fillStyle = this.color(i);
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.stroke();

			// Texto
			ctx.save();
			ctx.translate(this.center,this.center);
			ctx.rotate(start + angle/2);
			ctx.fillStyle = '#fff';
			ctx.font = Math.max(12, Math.floor(this.size/20)) + 'px sans-serif';
			ctx.textAlign = 'right';
			ctx.textBaseline = 'middle';
			const text = this.prizes[i] || '';
			// Ajuste simple: recortar si demasiado largo
			let display = text;
			if(display.length>20) display = display.slice(0,20) + '...';
			ctx.fillText(display, this.radius - 10, 0);
			ctx.restore();
		}

		// botón central con división horizontal y bordes redondeados
		const buttonRadius = 16;
		ctx.lineWidth = 4;
		ctx.strokeStyle = '#FBCDEB';

		ctx.beginPath();
		ctx.arc(this.center, this.center, buttonRadius, 0, Math.PI, true);
		ctx.closePath();
		ctx.fillStyle = '#111';
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(this.center, this.center, buttonRadius, Math.PI, 0, true);
		ctx.closePath();
		ctx.fillStyle = '#FBCDEB';
		ctx.fill();
		ctx.stroke();

		if(this.centerImage && this.centerImage.complete){
			const size = 40;
			ctx.drawImage(this.centerImage, this.center - size/2, this.center - size/2, size, size);
		}

		// marcador/puntero a la derecha con punta hacia dentro
		ctx.fillStyle = '#fff';
		ctx.beginPath();
		const outerX = this.center + this.radius + 8;
		const innerX = this.center + this.radius - 6;
		ctx.moveTo(innerX, this.center);
		ctx.lineTo(outerX, this.center - 12);
		ctx.lineTo(outerX, this.center + 12);
		ctx.closePath();
		ctx.fill();

	}

	_loadConfettiImages(paths){
		this.confettiImages = paths.map(src => {
			const img = new Image();
			img.src = src;
			return img;
		});
	}

	_spawnConfetti(){
		const w = window.innerWidth;
		const h = window.innerHeight;
		const count = 42 + Math.floor(Math.random()*18);
		for(let i=0;i<count;i++){
			const img = this.confettiImages[Math.floor(Math.random()*this.confettiImages.length)];
			const fromTop = i < Math.floor(count * 0.75);
			if(fromTop){
				this.confetti.push({
					x: Math.random() * w,
					y: Math.random() * 80 - 60,
					vx: (Math.random()-0.5) * 6,
					vy: 1.5 + Math.random() * 4,
					size: 24 + Math.random()*38,
					rotation: Math.random()*Math.PI*2,
					dRotation: (Math.random()-0.5) * 0.35,
					life: 1,
					img,
				});
			} else {
				this.confetti.push({
					x: this.center + (Math.random()-0.5) * 52,
					y: this.center + (Math.random()-0.5) * 52,
					vx: (Math.random()-0.5) * 4,
					vy: (Math.random()-0.5) * 4,
					size: 22 + Math.random()*28,
					rotation: Math.random()*Math.PI*2,
					dRotation: (Math.random()-0.5) * 0.35,
					life: 1,
					img,
				});
			}
		}
		this._runConfetti();
	}

	_updateConfetti(){
		const w = window.innerWidth;
		const h = window.innerHeight;
		for(let i=this.confetti.length-1;i>=0;i--){
			const piece = this.confetti[i];
			piece.vy += 0.08;
			piece.x += piece.vx;
			piece.y += piece.vy;
			piece.rotation += piece.dRotation;
			piece.life -= 0.016;
			if(piece.life <= 0 || piece.y > h + 40 || piece.x < -40 || piece.x > w + 40){
				this.confetti.splice(i,1);
			}
		}
	}

	_runConfetti(){
		if(this.confettiTimer) return;
		const loop = () => {
			if(this.confetti.length === 0){
				this.confettiTimer = null;
				this.confettiCtx.clearRect(0,0,window.innerWidth, window.innerHeight);
				return;
			}
			this._updateConfetti();
			this._drawConfettiLayer();
			this.confettiTimer = requestAnimationFrame(loop);
		};
		this.confettiTimer = requestAnimationFrame(loop);
	}

	_drawConfettiLayer(){
		const ctx = this.confettiCtx;
		const w = window.innerWidth;
		const h = window.innerHeight;
		ctx.clearRect(0,0,w,h);
		for(const piece of this.confetti){
			ctx.save();
			ctx.globalAlpha = Math.max(0, piece.life);
			ctx.translate(piece.x, piece.y);
			ctx.rotate(piece.rotation);
			ctx.drawImage(piece.img, -piece.size/2, -piece.size/2, piece.size, piece.size);
			ctx.restore();
		}
	}

	spin(){
		if(this.isSpinning) return;
		if(this.prizes.length === 0) return;
		this.isSpinning = true;
		const len = this.prizes.length;
		const angle = (Math.PI*2) / len;
		const targetIndex = Math.floor(Math.random()*len);

		// Queremos que el centro del sector target quede en el ángulo 0 (puntero)
		const targetAngle = - (targetIndex + 0.5) * angle;
		const rounds = 3 + Math.floor(Math.random()*3); // entre 3 y 5 vueltas
		const finalRotation = (Math.PI*2) * rounds + targetAngle;
		const startRotation = this.rotation % (Math.PI*2);
		const delta = finalRotation - startRotation;
		const duration = 3000 + Math.floor(Math.random()*1500);
		const startTime = performance.now();

		const easeOutCubic = t => 1 - Math.pow(1-t,3);

		const animate = (now) => {
			const elapsed = now - startTime;
			const t = Math.min(1, elapsed / duration);
			this.rotation = startRotation + delta * easeOutCubic(t);
			this.draw();
			if(t<1){
				requestAnimationFrame(animate);
			} else {
				this.isSpinning = false;
				// Normalizar rotation
				this.rotation = finalRotation % (Math.PI*2);
				this.draw();
				// Calcular índice ganador
				const normalized = ((-this.rotation) % (Math.PI*2) + Math.PI*2) % (Math.PI*2);
				const winner = Math.floor(normalized / angle);
				const prize = this.prizes[winner];
				try{ this.onResult(winner, prize); }catch(e){ console.error(e); }
				this._spawnConfetti();
			}
		};

		requestAnimationFrame(animate);
	}
}

