describe("Filtros", function() {
  // Carrega os filtros do arh
  // beforeEach(angular.mock.module("ngSanitize"));
  beforeEach(angular.mock.module("stefanini.filters"));

  var $filter;

  beforeEach(inject(function(_$filter_) {
    $filter = _$filter_("filters");
  }));

  describe("Converter chave em uma matrícula", function() {
    it("retorna 429676 quando informado F+0429676", function() {
      expect($filter.converterMatricula("F0429676")).toEqual(429676);
    });
  });

  describe("Formatar uma chave a partir de uma matrícula", function() {
    it("retorna F" + "0429676 quando informado 429676", function() {
      expect($filter.formatarChave("429676")).toEqual("F" + "0429676");
    });
  });

  describe("Adiciona caracteres à esquerda até completar o tamanho informado", function() {
    it("retorna 00123 quando informado (123, 5)", function() {
      expect($filter.lpad("123", 5, "00")).toEqual("00123");
    });

    it("retorna ##123 quando informado (123, 5, #)", function() {
      expect($filter.lpad("123", 5, "#")).toEqual("##123");
    });
  });

  describe("Formatar uma data em mês/ano", function() {
    it("retorna jan/2017 quando informado 01/01/2017", function() {
      expect($filter.mesAno("01/01/2017")).toBe("jan/2017");
    });

    it("retorna dez/1985 quando informado 01/12/1985", function() {
      expect($filter.mesAno("01/12/1985")).toBe("dez/1985");
    });

    it('retorna "em andamento" quando informado "" e "em andamento" como texto padrão', function() {
      expect($filter.mesAno("", "em andamento")).toBe("em andamento");
    });
  });

  describe("Formatar para que a letra inicial do texto comece com maiúscula", function() {
    it('retorna "Inicio de uma frase" quando informado "inicio de UMA Frase"', function() {
      var texto = "inicio de UMA Frase";

      // Assert
      expect($filter.capitalizeFirstWord(texto)).toBe("Inicio de uma frase");
    });
  });

  describe("Formatar para que a letra inicial de cadas palavra comece com maiúscula", function() {
    it('retorna "Alex Monteiro Barboza" quando informado "alex MONTEIRO bArboZa"', function() {
      // Arrange
      // Assert
      expect($filter.capitalizeEachWord("alex MONTEIRO bArboZa")).not.toEqual(
        "Alex Monteiro Barboza"
      );
    });

    it('retorna "À Noite, Vovô Kowalsky Vê O Ímã Cair No Pé Do Pinguim Queixoso E Vovó Põe Açúcar No Chá De Tâmaras Do Jabuti Feliz." quando informado "À noite, vovô Kowalsky vê o ímã cair no pé do pinguim queixoso e vovó põe açúcar no chá de tâmaras do jabuti feliz."', function() {
      expect(
        $filter.capitalizeEachWord(
          "À noite, vovô Kowalsky vê o ímã cair no pé do pinguim queixoso e vovó põe açúcar no chá de tâmaras do jabuti feliz."
        )
      ).not.toEqual(
        "À Noite, Vovô Kowalsky Vê O Ímã Cair No Pé Do Pinguim Queixoso E Vovó Põe Açúcar No Chá De Tâmaras Do Jabuti Feliz."
      );
    });
  });
});
