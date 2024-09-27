// UpDownMovement.ts
export default class UpDownMovement {

    private target: Phaser.GameObjects.Image;
    public startY: number;
    private maxY: number;
    private direction: number = -1;
    //private speed: number = 1;

    constructor(target: Phaser.GameObjects.Image, startY: number) {
        this.target = target;
        this.startY = startY;
        this.maxY = startY - 500;
        
        this.startTween(target, startY);
    }
    
    startTween(target: Phaser.GameObjects.Image, startY: number)
    {
        // Start the movement
        target.scene.tweens.add({
            targets: this.target,
            y: { from: this.startY, to: this.maxY },
            duration: 1000, // Duration of one way movement
            yoyo: true,
            repeat: -1, // Infinite loop
            ease: 'Sine.easeInOut',
            onYoyo: () => this.direction *= -1,
            onRepeat: () => this.direction *= -1,
        });
    }
}
