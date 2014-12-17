function VRTitle() {
	var self = this;
	this.mesh = null;
	this.siteMesh = null;
	this.visible = false;
	this.d23 = null;

	this.ready = new Promise(function(resolve, reject) {

		var d23 = new DOM2three.load('d23/title', {
			pixelScale: 0.0035
		});

		d23.loaded
			.then( function() {
				// current site frame
				var node = d23.getNodeById('current', true);
				var mesh = node.mesh;

				mesh.scale.multiplyScalar(0.25);

				mesh.visible = self.visible;

				self.mesh = mesh;

				if (self.visible) {
					self.show();
				}

				self.d23 = d23;

				self.setTitle('Mozilla VR research');
				self.setUrl('http://www.mozvr.com');
				self.setCredits('Casey Yee\nJosh Carpenter');

				resolve();
			});
	});

	return this;
}


VRTitle.prototype.show = function(delay) {
	var self = this;
	if (!self.visible) {
		self.visible = true;

		function animate() {
			self.mesh.visible = true;
			self.animateIn(self.mesh);
		}

		if (delay) {
			setTimeout(animate, delay)
		} else {
			animate();
		}
	}
}

VRTitle.prototype.hide = function(delay) {
	self = this;

	var	animDone = self.animateOut(self.mesh, delay);

	animDone.then(function() {
		self.visible = false;
		self.mesh.visible = false;
	});

	return animDone;
};

VRTitle.prototype.setCredits = function(value) {
	var credit = value.toUpperCase();

	this.d23.setText('current-credits', credit, {
		newLine: '%0D',
		lineHeight: 25,
		verticalAlign: 'bottom'
	});
};

VRTitle.prototype.setTitle = function(value) {
	this.d23.setText('current-title', value.toUpperCase(), {
		offsetY: -14,
		offsetX: 10
	});
};

VRTitle.prototype.setUrl = function(value) {
	var titleUrl = value.toUpperCase();

	// strip uggly porotocal lines
	var strip = ['HTTP://', 'HTTPS://'];

	strip.forEach(function(str) {
		titleUrl = titleUrl.replace(str, '');
	});

	// get rid of trailing slashes
 	if (titleUrl.substr(-1) == '/') {
  	titleUrl = titleUrl.substr(0, titleUrl.length - 1);
  };

  this.d23.setText('current-url', titleUrl, {
		offsetY: -8,
		offsetX: 10
	});
};

VRTitle.prototype.animateOut = function(mesh, delay) {
	return new Promise(function(resolve, reject) {
		for (var i = 0; i < mesh.children.length; i++) {
			var m = mesh.children[i];

			var tween = new TWEEN.Tween( m.material )
				.to({ opacity: 0 }, 500 )
				.easing(TWEEN.Easing.Exponential.Out)
				.onComplete(function() {
					resolve();
				})

			if (delay) {
				tween.delay(delay);
			}

			tween.start();
		}

	});
};

VRTitle.prototype.animateIn = function(mesh) {
	return new Promise(function(resolve, reject) {
		for (var i = 0; i < mesh.children.length; i++) {
			var m = mesh.children[i];
			m.material.opacity = 0;
			var tween = new TWEEN.Tween( m.material )
				.to({ opacity: 1 }, 1000 )
				.easing(TWEEN.Easing.Exponential.Out)
				.onComplete(function() {
					resolve();
				})
				.start();
		}


	});
};
