exports.up = async (pgm) => {
  // Insert sections
  await pgm.sql(`
    INSERT INTO sections (name, description) VALUES
    ('Experiência Criativa', 'Discussões e projetos de criatividade aplicada'),
    ('Resolução de Problemas com Grafos', 'Teoria e prática de grafos'),
    ('Métodos Quantitativos de Computação', 'Estudo de métodos quantitativos'),
    ('Complexidade de Algoritmos', 'Análise e discussão sobre complexidade'),
    ('Métodos de Pesquisa Científica', 'Metodologia e práticas de pesquisa')
  `);

  // Insert categories
  await pgm.sql(`
    INSERT INTO categories (section_id, parent_id, name, description, is_subfolder) VALUES
    ((SELECT id FROM sections WHERE name = 'Experiência Criativa'), NULL, 'Projetos', 'Compartilhe seus projetos criativos', false),
    ((SELECT id FROM sections WHERE name = 'Experiência Criativa'), NULL, 'Discussões Gerais', 'Debates sobre criatividade', false),
    ((SELECT id FROM sections WHERE name = 'Resolução de Problemas com Grafos'), NULL, 'Teoria dos Grafos', 'Conceitos e fundamentos', false),
    ((SELECT id FROM sections WHERE name = 'Resolução de Problemas com Grafos'), NULL, 'Aplicações', 'Problemas resolvidos com grafos', false),
    ((SELECT id FROM sections WHERE name = 'Métodos Quantitativos de Computação'), NULL, 'Estudos de Caso', 'Exemplos práticos', false),
    ((SELECT id FROM sections WHERE name = 'Métodos Quantitativos de Computação'), NULL, 'Ferramentas', 'Softwares e métodos', false),
    ((SELECT id FROM sections WHERE name = 'Complexidade de Algoritmos'), NULL, 'Análise de Algoritmos', 'Discussão sobre complexidade', false),
    ((SELECT id FROM sections WHERE name = 'Complexidade de Algoritmos'), NULL, 'Exercícios', 'Exercícios resolvidos', false),
    ((SELECT id FROM sections WHERE name = 'Métodos de Pesquisa Científica'), NULL, 'Metodologia', 'Discussão sobre métodos científicos', false),
    ((SELECT id FROM sections WHERE name = 'Métodos de Pesquisa Científica'), NULL, 'Publicações', 'Compartilhamento de artigos', false)
  `);

  // Insert subcategories
  await pgm.sql(`
    -- Experiência Criativa
    INSERT INTO categories (section_id, parent_id, name, description, is_subfolder) VALUES
      ((SELECT id FROM sections WHERE name = 'Experiência Criativa'), (SELECT id FROM categories WHERE name = 'Projetos'), 'Ideias em Andamento', 'Projetos em desenvolvimento', true),
      ((SELECT id FROM sections WHERE name = 'Experiência Criativa'), (SELECT id FROM categories WHERE name = 'Projetos'), 'Projetos Concluídos', 'Projetos finalizados', true),
      ((SELECT id FROM sections WHERE name = 'Experiência Criativa'), (SELECT id FROM categories WHERE name = 'Projetos'), 'Colaborações', 'Busque ou ofereça colaboração', true),
      ((SELECT id FROM sections WHERE name = 'Experiência Criativa'), (SELECT id FROM categories WHERE name = 'Discussões Gerais'), 'Inspirações', 'Compartilhe fontes de inspiração', true),
      ((SELECT id FROM sections WHERE name = 'Experiência Criativa'), (SELECT id FROM categories WHERE name = 'Discussões Gerais'), 'Ferramentas Criativas', 'Sugestões de ferramentas', true),

    -- Resolução de Problemas com Grafos
      ((SELECT id FROM sections WHERE name = 'Resolução de Problemas com Grafos'), (SELECT id FROM categories WHERE name = 'Teoria dos Grafos'), 'Algoritmos Clássicos', 'Discussão sobre algoritmos clássicos', true),
      ((SELECT id FROM sections WHERE name = 'Resolução de Problemas com Grafos'), (SELECT id FROM categories WHERE name = 'Teoria dos Grafos'), 'Propriedades de Grafos', 'Estudo das propriedades', true),
      ((SELECT id FROM sections WHERE name = 'Resolução de Problemas com Grafos'), (SELECT id FROM categories WHERE name = 'Aplicações'), 'Grafos em Redes', 'Aplicações em redes', true),
      ((SELECT id FROM sections WHERE name = 'Resolução de Problemas com Grafos'), (SELECT id FROM categories WHERE name = 'Aplicações'), 'Grafos em IA', 'Aplicações em inteligência artificial', true),

    -- Métodos Quantitativos de Computação
      ((SELECT id FROM sections WHERE name = 'Métodos Quantitativos de Computação'), (SELECT id FROM categories WHERE name = 'Estudos de Caso'), 'Modelagem Matemática', 'Modelos matemáticos aplicados', true),
      ((SELECT id FROM sections WHERE name = 'Métodos Quantitativos de Computação'), (SELECT id FROM categories WHERE name = 'Estudos de Caso'), 'Simulações', 'Simulações computacionais', true),
      ((SELECT id FROM sections WHERE name = 'Métodos Quantitativos de Computação'), (SELECT id FROM categories WHERE name = 'Ferramentas'), 'Softwares Estatísticos', 'Ferramentas para análise estatística', true),
      ((SELECT id FROM sections WHERE name = 'Métodos Quantitativos de Computação'), (SELECT id FROM categories WHERE name = 'Ferramentas'), 'Linguagens de Programação', 'Linguagens usadas em métodos quantitativos', true),

    -- Complexidade de Algoritmos
      ((SELECT id FROM sections WHERE name = 'Complexidade de Algoritmos'), (SELECT id FROM categories WHERE name = 'Análise de Algoritmos'), 'Algoritmos P vs NP', 'Discussão sobre P vs NP', true),
      ((SELECT id FROM sections WHERE name = 'Complexidade de Algoritmos'), (SELECT id FROM categories WHERE name = 'Análise de Algoritmos'), 'Algoritmos Aproximados', 'Estudo de algoritmos aproximados', true),
      ((SELECT id FROM sections WHERE name = 'Complexidade de Algoritmos'), (SELECT id FROM categories WHERE name = 'Exercícios'), 'Desafios Semanais', 'Exercícios propostos semanalmente', true),
      ((SELECT id FROM sections WHERE name = 'Complexidade de Algoritmos'), (SELECT id FROM categories WHERE name = 'Exercícios'), 'Resoluções Comentadas', 'Resoluções detalhadas', true),

    -- Métodos de Pesquisa Científica
      ((SELECT id FROM sections WHERE name = 'Métodos de Pesquisa Científica'), (SELECT id FROM categories WHERE name = 'Metodologia'), 'Revisão Bibliográfica', 'Discussão sobre revisão de literatura', true),
      ((SELECT id FROM sections WHERE name = 'Métodos de Pesquisa Científica'), (SELECT id FROM categories WHERE name = 'Metodologia'), 'Métodos Qualitativos', 'Discussão sobre métodos qualitativos', true),
      ((SELECT id FROM sections WHERE name = 'Métodos de Pesquisa Científica'), (SELECT id FROM categories WHERE name = 'Metodologia'), 'Métodos Quantitativos', 'Discussão sobre métodos quantitativos', true),
      ((SELECT id FROM sections WHERE name = 'Métodos de Pesquisa Científica'), (SELECT id FROM categories WHERE name = 'Publicações'), 'Artigos Recentes', 'Compartilhamento de artigos recentes', true),
      ((SELECT id FROM sections WHERE name = 'Métodos de Pesquisa Científica'), (SELECT id FROM categories WHERE name = 'Publicações'), 'Eventos e Conferências', 'Divulgação de eventos científicos', true)
  `);

  // Insert tags
  await pgm.sql(`
    INSERT INTO tags (name) VALUES
      ('Teórico'),
      ('Prático'),
      ('Dúvida'),
      ('Tutorial'),
      ('Exemplo'),
      ('Resolução'),
      ('Colaboração'),
      ('Revisado'),
      ('Em andamento'),
      ('Finalizado'),
      ('Publicação'),
      ('Exercício')
  `);

  // Associate tags with categories
await pgm.sql(`
    -- Experiência Criativa
    INSERT INTO category_tags (category_id, tag_id) VALUES
      ((SELECT id FROM categories WHERE name = 'Ideias em Andamento'), (SELECT id FROM tags WHERE name = 'Em andamento')),
      ((SELECT id FROM categories WHERE name = 'Ideias em Andamento'), (SELECT id FROM tags WHERE name = 'Colaboração')),
      ((SELECT id FROM categories WHERE name = 'Projetos Concluídos'), (SELECT id FROM tags WHERE name = 'Finalizado')),
      ((SELECT id FROM categories WHERE name = 'Projetos Concluídos'), (SELECT id FROM tags WHERE name = 'Revisado')),
      ((SELECT id FROM categories WHERE name = 'Colaborações'), (SELECT id FROM tags WHERE name = 'Colaboração')),
      ((SELECT id FROM categories WHERE name = 'Inspirações'), (SELECT id FROM tags WHERE name = 'Teórico')),
      ((SELECT id FROM categories WHERE name = 'Ferramentas Criativas'), (SELECT id FROM tags WHERE name = 'Tutorial')),

    -- Resolução de Problemas com Grafos
      ((SELECT id FROM categories WHERE name = 'Algoritmos Clássicos'), (SELECT id FROM tags WHERE name = 'Teórico')),
      ((SELECT id FROM categories WHERE name = 'Algoritmos Clássicos'), (SELECT id FROM tags WHERE name = 'Exemplo')),
      ((SELECT id FROM categories WHERE name = 'Propriedades de Grafos'), (SELECT id FROM tags WHERE name = 'Teórico')),
      ((SELECT id FROM categories WHERE name = 'Grafos em Redes'), (SELECT id FROM tags WHERE name = 'Prático')),
      ((SELECT id FROM categories WHERE name = 'Grafos em Redes'), (SELECT id FROM tags WHERE name = 'Exemplo')),
      ((SELECT id FROM categories WHERE name = 'Grafos em IA'), (SELECT id FROM tags WHERE name = 'Prático')),

    -- Métodos Quantitativos de Computação
      ((SELECT id FROM categories WHERE name = 'Modelagem Matemática'), (SELECT id FROM tags WHERE name = 'Teórico')),
      ((SELECT id FROM categories WHERE name = 'Modelagem Matemática'), (SELECT id FROM tags WHERE name = 'Tutorial')),
      ((SELECT id FROM categories WHERE name = 'Simulações'), (SELECT id FROM tags WHERE name = 'Prático')),
      ((SELECT id FROM categories WHERE name = 'Simulações'), (SELECT id FROM tags WHERE name = 'Exemplo')),
      ((SELECT id FROM categories WHERE name = 'Softwares Estatísticos'), (SELECT id FROM tags WHERE name = 'Tutorial')),
      ((SELECT id FROM categories WHERE name = 'Softwares Estatísticos'), (SELECT id FROM tags WHERE name = 'Prático')),
      ((SELECT id FROM categories WHERE name = 'Linguagens de Programação'), (SELECT id FROM tags WHERE name = 'Tutorial')),

    -- Complexidade de Algoritmos
      ((SELECT id FROM categories WHERE name = 'Algoritmos P vs NP'), (SELECT id FROM tags WHERE name = 'Teórico')),
      ((SELECT id FROM categories WHERE name = 'Algoritmos P vs NP'), (SELECT id FROM tags WHERE name = 'Dúvida')),
      ((SELECT id FROM categories WHERE name = 'Algoritmos Aproximados'), (SELECT id FROM tags WHERE name = 'Teórico')),
      ((SELECT id FROM categories WHERE name = 'Desafios Semanais'), (SELECT id FROM tags WHERE name = 'Exercício')),
      ((SELECT id FROM categories WHERE name = 'Desafios Semanais'), (SELECT id FROM tags WHERE name = 'Resolução')),
      ((SELECT id FROM categories WHERE name = 'Resoluções Comentadas'), (SELECT id FROM tags WHERE name = 'Resolução')),

    -- Métodos de Pesquisa Científica
      ((SELECT id FROM categories WHERE name = 'Revisão Bibliográfica'), (SELECT id FROM tags WHERE name = 'Teórico')),
      ((SELECT id FROM categories WHERE name = 'Revisão Bibliográfica'), (SELECT id FROM tags WHERE name = 'Revisado')),
      ((SELECT id FROM categories WHERE name = 'Métodos Qualitativos'), (SELECT id FROM tags WHERE name = 'Teórico')),
      ((SELECT id FROM categories WHERE name = 'Métodos Quantitativos'), (SELECT id FROM tags WHERE name = 'Teórico')),
      ((SELECT id FROM categories WHERE name = 'Artigos Recentes'), (SELECT id FROM tags WHERE name = 'Publicação')),
      ((SELECT id FROM categories WHERE name = 'Artigos Recentes'), (SELECT id FROM tags WHERE name = 'Revisado')),
      ((SELECT id FROM categories WHERE name = 'Eventos e Conferências'), (SELECT id FROM tags WHERE name = 'Publicação'))
  `);

};

// eslint-disable-next-line no-unused-vars
exports.down = async (pgm) => {};
