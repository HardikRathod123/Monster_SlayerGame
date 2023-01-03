function getattackDamageValue(min, max) {
  const attackDamage = Math.floor(Math.random() * (max - min)) + min;
  return attackDamage;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealthPoints: 100,
      monsterHealthPoints: 100,
      availableSpecialAttacks: 0,
      availableHeal: 0,
      roundsPoints: 0,
      winner: null,
      logMessages: [],
    };
  },

  watch: {
    roundsPoints() {
      this.availableSpecialAttacks = this.roundsPoints / 4;
      this.availableHeal = this.roundsPoints / 3;
    },
    playerHealthPoints(value) {
      if (value <= 0 && this.monsterHealthPoints <= 0) this.winner = "draw";
      else if (value <= 0) this.winner = "monster";
    },
    monsterHealthPoints(value) {
      if (value <= 0 && this.monsterHealthPoints <= 0) this.winner = "draw";
      else if (value <= 0) this.winner = "player";
    },
  },

  computed: {
    playerHealthBar() {
      if (this.playerHealthPoints < 0) return { width: "0%" };
      return { width: this.playerHealthPoints + "%" };
    },
    monsterHealthBar() {
      if (this.playerHealthPoints < 0) return { width: "0%" };
      return { width: this.monsterHealthPoints + "%" };
    },
    canUseSpecialAttack() {
      return this.availableSpecialAttacks >= 1;
    },
    canBeHealed() {
      return this.availableHeal >= 1;
    },
  },

  methods: {
    attackMonster() {
      this.roundsPoints++;
      const attackDamage = getattackDamageValue(5, 12);
      this.monsterHealthPoints -= attackDamage;
      this.addLogMessages("player", "attack", attackDamage);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackDamage = getattackDamageValue(8, 15);
      this.playerHealthPoints -= attackDamage;
      this.addLogMessages("monster", "attack", attackDamage);
    },
    specialAttackMonster() {
      if (this.availableSpecialAttacks > 0) {
        this.roundsPoints -= 4;
        const attackDamage = getattackDamageValue(10, 25);
        this.monsterHealthPoints -= attackDamage;
        this.addLogMessages("player", "attack", attackDamage);
        this.attackPlayer();
      }
    },
    healPlayer() {
      if (this.availableHeal >= 1) {
        this.roundsPoints -= 3;
        const healValue = getattackDamageValue(10, 20);
        if (healValue + this.playerHealthPoints > 100)
          this.playerHealthPoints = 100;
        else this.playerHealthPoints += healValue;
        this.addLogMessages("player", "heal", healValue);
        this.attackPlayer();
      }
    },
    resetGame() {
      this.playerHealthPoints = 100;
      this.monsterHealthPoints = 100;
      this.winner = null;
      this.roundsPoints = 0;
      this.logMessages = [];
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessages(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
    attackerStyle(who) {
      if (who === "player") return "log--player";
      else return "log--monster";
    },
  },
});

app.mount(game);
