import { Meal } from '../types';

export const meals: Meal[] = [
  // ─── BREAKFASTS (18) ────────────────────────────────────────────────────────
  {
    id: 'b01', name: 'Tropical Protein Smoothie Bowl', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 360, proteinPerServing: 28, carbsPerServing: 42, fatPerServing: 8,
    servingSize: '1 bowl', prepTime: 10, weekdayFriendly: true,
    ingredients: ['1 scoop vanilla protein powder', '1 frozen banana', '½ cup frozen mango', '½ cup coconut milk', '2 tbsp granola', '¼ cup mixed berries', '1 tbsp chia seeds'],
    instructions: ['Blend protein powder, banana, mango, and coconut milk until thick and smooth.', 'Pour into a bowl and top with granola, berries, and chia seeds.', 'Serve immediately.'],
    tags: ['high-protein', 'no-cook', 'vegan-friendly'],
  },
  {
    id: 'b02', name: 'Greek Yogurt Parfait with Berries', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 320, proteinPerServing: 24, carbsPerServing: 38, fatPerServing: 6,
    servingSize: '1 parfait', prepTime: 5, weekdayFriendly: true,
    ingredients: ['1 cup plain Greek yogurt (non-fat)', '¼ cup granola', '½ cup mixed berries', '1 tbsp honey', '1 tbsp chopped walnuts'],
    instructions: ['Layer half the yogurt in a glass or bowl.', 'Add half the granola and berries.', 'Repeat layers and drizzle with honey and walnuts.'],
    tags: ['high-protein', 'no-cook', 'quick'],
  },
  {
    id: 'b03', name: 'Avocado Toast with Feta & Cherry Tomatoes', cuisine: 'mediterranean', type: 'breakfast',
    caloriesPerServing: 340, proteinPerServing: 12, carbsPerServing: 34, fatPerServing: 18,
    servingSize: '2 slices', prepTime: 10, weekdayFriendly: true,
    ingredients: ['2 slices whole grain bread, toasted', '1 ripe avocado', '¼ cup crumbled feta', '½ cup cherry tomatoes, halved', 'Juice of ½ lemon', 'Salt, pepper, red pepper flakes'],
    instructions: ['Mash avocado with lemon juice, salt, and pepper.', 'Spread on toasted bread.', 'Top with cherry tomatoes, feta, and red pepper flakes.'],
    tags: ['heart-healthy', 'quick', 'vegetarian'],
  },
  {
    id: 'b04', name: 'Overnight Oats with Almond Butter & Berries', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 390, proteinPerServing: 18, carbsPerServing: 48, fatPerServing: 12,
    servingSize: '1 jar', prepTime: 5, weekdayFriendly: true,
    ingredients: ['½ cup rolled oats', '¾ cup almond milk', '2 tbsp almond butter', '1 tbsp chia seeds', '1 tsp maple syrup', '½ cup mixed berries'],
    instructions: ['Combine oats, almond milk, almond butter, chia seeds, and maple syrup in a jar.', 'Stir well, seal, and refrigerate overnight (or at least 4 hours).', 'Top with berries before serving — no cooking needed.'],
    tags: ['meal-prep', 'high-fiber', 'no-cook'],
  },
  {
    id: 'b05', name: 'Tofu Scramble with Bell Peppers & Spinach', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 280, proteinPerServing: 22, carbsPerServing: 12, fatPerServing: 14,
    servingSize: '1 plate', prepTime: 15, weekdayFriendly: true,
    ingredients: ['200g firm tofu, drained and crumbled', '1 cup baby spinach', '½ red bell pepper, diced', '½ yellow bell pepper, diced', '1 tsp turmeric', '2 tbsp nutritional yeast', '1 tsp cumin, 1 tbsp olive oil, salt & pepper'],
    instructions: ['Heat olive oil in a skillet over medium heat.', 'Add bell peppers and sauté 3 minutes.', 'Add crumbled tofu, turmeric, cumin, and nutritional yeast. Cook 5 minutes.', 'Stir in spinach until wilted. Season and serve.'],
    tags: ['high-protein', 'vegan', 'low-carb', 'egg-free'],
  },
  {
    id: 'b06', name: 'Indian Masala Oats (Jain-style)', cuisine: 'indian', type: 'breakfast',
    caloriesPerServing: 310, proteinPerServing: 12, carbsPerServing: 44, fatPerServing: 9,
    servingSize: '1 bowl', prepTime: 15, weekdayFriendly: true,
    ingredients: ['½ cup rolled oats', '1 cup vegetable broth', '½ cup frozen peas', '½ red bell pepper, diced', '1 tsp cumin seeds, ¼ tsp turmeric, pinch asafoetida (hing)', '1 tsp fresh grated ginger', '1 tsp oil, salt & coriander to garnish'],
    instructions: ['Heat oil, add cumin seeds and asafoetida until fragrant (30 sec).', 'Add bell pepper and ginger; sauté 2 minutes.', 'Add oats, peas, turmeric, and broth. Cook 5–7 minutes until creamy.', 'Garnish with fresh coriander and serve hot.'],
    tags: ['indian', 'jain-style', 'savory', 'warming'],
  },
  {
    id: 'b07', name: 'Banana Oat Protein Pancakes', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 350, proteinPerServing: 26, carbsPerServing: 40, fatPerServing: 8,
    servingSize: '3 pancakes', prepTime: 20, weekdayFriendly: true,
    ingredients: ['1 ripe banana, mashed', '½ cup rolled oats, blended to flour', '1 scoop vanilla protein powder', '¼ cup almond milk', '1 tbsp chia seeds soaked in 3 tbsp water (egg replacer)', '½ tsp baking powder', 'Berries to serve'],
    instructions: ['Mix chia "egg" with banana until combined.', 'Stir in oat flour, protein powder, almond milk, and baking powder.', 'Cook on a lightly oiled non-stick pan over medium-low heat, 2–3 min per side.', 'Serve with fresh berries.'],
    tags: ['high-protein', 'egg-free', 'gluten-friendly'],
  },
  {
    id: 'b08', name: 'Coconut Mango Chia Pudding', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 290, proteinPerServing: 10, carbsPerServing: 36, fatPerServing: 12,
    servingSize: '1 jar', prepTime: 5, weekdayFriendly: true,
    ingredients: ['3 tbsp chia seeds', '1 cup light coconut milk', '1 tsp vanilla extract', '1 tbsp maple syrup', '½ cup fresh mango, diced', '2 tbsp toasted coconut flakes'],
    instructions: ['Whisk chia seeds, coconut milk, vanilla, and maple syrup.', 'Refrigerate 4+ hours or overnight until thick.', 'Top with mango and coconut flakes before serving.'],
    tags: ['meal-prep', 'vegan', 'no-cook'],
  },
  {
    id: 'b09', name: 'Poha with Peanuts & Vegetables (Jain-style)', cuisine: 'indian', type: 'breakfast',
    caloriesPerServing: 320, proteinPerServing: 11, carbsPerServing: 46, fatPerServing: 10,
    servingSize: '1 bowl', prepTime: 15, weekdayFriendly: true,
    ingredients: ['1 cup thick poha (flattened rice), rinsed and drained', '¼ cup roasted peanuts', '½ red bell pepper, diced', '½ cup frozen peas', '1 tsp mustard seeds, ¼ tsp turmeric, pinch asafoetida', '8 curry leaves, juice of 1 lime', '1 tsp oil, salt & fresh coriander'],
    instructions: ['Heat oil; add mustard seeds and asafoetida. Once seeds pop, add curry leaves.', 'Add bell pepper and peas; sauté 3 minutes.', 'Add drained poha, turmeric, salt, and peanuts. Mix gently and cook 3 minutes.', 'Squeeze lime, garnish with coriander, and serve.'],
    tags: ['indian', 'jain-style', 'light', 'quick'],
  },
  {
    id: 'b10', name: 'Green Power Smoothie', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 380, proteinPerServing: 30, carbsPerServing: 38, fatPerServing: 10,
    servingSize: '1 large glass', prepTime: 5, weekdayFriendly: true,
    ingredients: ['1 scoop chocolate or vanilla protein powder', '1 frozen banana', '1 cup baby spinach', '2 tbsp peanut butter', '1 cup almond milk', '½ cup ice'],
    instructions: ['Add all ingredients to blender.', 'Blend until smooth and creamy, 60 seconds.', 'Serve immediately.'],
    tags: ['high-protein', 'quick', 'no-cook', 'vegan-friendly'],
  },
  {
    id: 'b11', name: 'Cottage Cheese Bowl with Peaches & Almonds', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 280, proteinPerServing: 26, carbsPerServing: 22, fatPerServing: 8,
    servingSize: '1 bowl', prepTime: 5, weekdayFriendly: true,
    ingredients: ['1 cup low-fat cottage cheese', '1 peach, sliced (or ½ cup canned in juice)', '2 tbsp slivered almonds', '1 tsp honey', '½ tsp cinnamon'],
    instructions: ['Spoon cottage cheese into a bowl.', 'Top with sliced peach, almonds, honey, and cinnamon.', 'Serve immediately.'],
    tags: ['high-protein', 'no-cook', 'quick', '5-minute'],
  },
  {
    id: 'b12', name: 'Moong Dal Cheela (Lentil Crepes)', cuisine: 'indian', type: 'breakfast',
    caloriesPerServing: 300, proteinPerServing: 18, carbsPerServing: 36, fatPerServing: 8,
    servingSize: '2 crepes', prepTime: 20, weekdayFriendly: true,
    ingredients: ['½ cup yellow moong dal, soaked 2 hrs and blended', '1 tsp grated ginger, 1 green chili (optional)', '½ tsp cumin seeds, ¼ tsp turmeric, pinch asafoetida', '½ cup finely diced bell pepper & spinach', 'Salt to taste, 1 tsp oil per crepe', 'Green chutney to serve'],
    instructions: ['Blend soaked dal with ginger, cumin, turmeric, asafoetida, and salt to smooth batter.', 'Stir in diced vegetables.', 'Pour ladle of batter onto oiled hot pan; spread thin. Cook 2–3 min per side.', 'Serve with green chutney.'],
    tags: ['indian', 'high-protein', 'jain-style', 'gluten-free'],
  },
  {
    id: 'b13', name: 'Bircher Muesli with Apple & Walnuts', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 370, proteinPerServing: 14, carbsPerServing: 50, fatPerServing: 13,
    servingSize: '1 bowl', prepTime: 5, weekdayFriendly: true,
    ingredients: ['½ cup rolled oats', '¾ cup plain Greek yogurt', '1 apple, grated', '2 tbsp chopped walnuts', '1 tbsp raisins', '1 tsp honey, juice of ½ lemon'],
    instructions: ['Combine oats, yogurt, grated apple, lemon juice, and honey.', 'Refrigerate overnight or 4+ hours.', 'Stir and top with walnuts and raisins before serving.'],
    tags: ['meal-prep', 'no-cook', 'high-fiber'],
  },
  {
    id: 'b14', name: 'Acaí Smoothie Bowl', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 340, proteinPerServing: 12, carbsPerServing: 48, fatPerServing: 11,
    servingSize: '1 bowl', prepTime: 10, weekdayFriendly: true,
    ingredients: ['1 packet frozen acaí (100g), unsweetened', '1 frozen banana', '½ cup almond milk', '2 tbsp granola', '½ cup mixed berries', '1 tbsp coconut flakes, 1 tsp honey'],
    instructions: ['Blend acaí, banana, and almond milk until thick — add minimal liquid.', 'Pour into bowl.', 'Top with granola, berries, coconut flakes, and honey.'],
    tags: ['antioxidant-rich', 'no-cook', 'vegan'],
  },
  {
    id: 'b15', name: 'Vegetable Upma (Jain-style)', cuisine: 'indian', type: 'breakfast',
    caloriesPerServing: 280, proteinPerServing: 10, carbsPerServing: 42, fatPerServing: 8,
    servingSize: '1 bowl', prepTime: 20, weekdayFriendly: true,
    ingredients: ['½ cup semolina (rava), dry-roasted', '1 cup vegetable broth', '½ cup mixed vegetables (carrot, peas, corn)', '1 tsp mustard seeds, 8 curry leaves, pinch asafoetida', '1 tsp grated ginger', '1 tsp oil, juice of ½ lemon, salt & coriander'],
    instructions: ['Heat oil; add mustard seeds and asafoetida. Add curry leaves and ginger.', 'Add vegetables and sauté 3 minutes.', 'Pour in hot broth, bring to boil, then stir in roasted semolina.', 'Cook stirring until thick (3–4 min). Add lemon juice and garnish with coriander.'],
    tags: ['indian', 'jain-style', 'savory', 'light'],
  },
  {
    id: 'b16', name: 'Ricotta Toast with Berries & Honey', cuisine: 'italian', type: 'breakfast',
    caloriesPerServing: 330, proteinPerServing: 18, carbsPerServing: 36, fatPerServing: 12,
    servingSize: '2 slices', prepTime: 10, weekdayFriendly: true,
    ingredients: ['2 slices whole grain sourdough, toasted', '½ cup part-skim ricotta', '½ cup mixed berries', '1 tsp honey', '1 tbsp chopped pistachios', 'Fresh mint to garnish'],
    instructions: ['Spread ricotta generously on toasted bread.', 'Top with berries, pistachios, and a drizzle of honey.', 'Garnish with fresh mint and serve immediately.'],
    tags: ['italian', 'high-protein', 'quick', 'elegant'],
  },
  {
    id: 'b17', name: 'Paneer Bhurji with Roti (Jain-style)', cuisine: 'indian', type: 'breakfast',
    caloriesPerServing: 380, proteinPerServing: 24, carbsPerServing: 32, fatPerServing: 16,
    servingSize: '1 plate + 2 rotis', prepTime: 20, weekdayFriendly: true,
    ingredients: ['150g paneer, crumbled', '1 tomato, finely chopped', '½ red bell pepper, finely diced', '1 tsp cumin seeds, ½ tsp turmeric, ½ tsp coriander powder, pinch asafoetida', '1 tsp grated ginger, 1 tsp oil', 'Fresh coriander, salt & pepper', '2 small whole wheat rotis'],
    instructions: ['Heat oil; add cumin seeds and asafoetida until fragrant.', 'Add ginger and bell pepper; sauté 2 minutes. Add tomato and cook until soft.', 'Add crumbled paneer, turmeric, coriander powder, and salt. Mix and cook 5 minutes.', 'Garnish with fresh coriander. Serve with warm rotis.'],
    tags: ['indian', 'jain-style', 'high-protein', 'satisfying'],
  },
  {
    id: 'b18', name: 'Peanut Butter Banana Oatmeal', cuisine: 'american', type: 'breakfast',
    caloriesPerServing: 400, proteinPerServing: 16, carbsPerServing: 54, fatPerServing: 14,
    servingSize: '1 bowl', prepTime: 10, weekdayFriendly: true,
    ingredients: ['½ cup rolled oats', '1 cup almond milk', '1 banana, sliced', '2 tbsp peanut butter', '1 tsp honey', '1 tbsp hemp seeds'],
    instructions: ['Cook oats with almond milk over medium heat 5 minutes, stirring often.', 'Stir in peanut butter and honey.', 'Top with banana slices and hemp seeds.'],
    tags: ['filling', 'warm', 'high-fiber'],
  },

  // ─── LUNCHES (18) ───────────────────────────────────────────────────────────
  {
    id: 'l01', name: 'Black Bean Burrito Bowl', cuisine: 'mexican', type: 'lunch',
    caloriesPerServing: 430, proteinPerServing: 18, carbsPerServing: 58, fatPerServing: 14,
    servingSize: '1 bowl', prepTime: 20, weekdayFriendly: true,
    ingredients: ['½ cup brown rice, cooked', '1 can (240g) black beans, drained & rinsed', '½ avocado, sliced', '½ cup corn (fresh or frozen)', '½ cup fresh salsa (tomato, lime, cilantro)', '¼ cup shredded cheese', '1 tbsp sour cream, juice of 1 lime, cumin & chili powder'],
    instructions: ['Warm black beans with cumin and chili powder in a small pan.', 'Layer rice in bowl, top with beans, corn, and avocado.', 'Add salsa, sour cream, cheese, and a squeeze of lime.'],
    tags: ['mexican', 'high-fiber', 'filling', 'meal-prep-friendly'],
  },
  {
    id: 'l02', name: 'Lentil Tacos with Corn Salsa', cuisine: 'mexican', type: 'lunch',
    caloriesPerServing: 390, proteinPerServing: 18, carbsPerServing: 52, fatPerServing: 10,
    servingSize: '3 tacos', prepTime: 25, weekdayFriendly: true,
    ingredients: ['½ cup green or brown lentils, cooked', '6 small corn tortillas', '1 tsp cumin, 1 tsp smoked paprika, ½ tsp chili powder', '½ cup corn, ½ cup cherry tomatoes halved, juice of 1 lime', 'Fresh cilantro, shredded cabbage, hot sauce'],
    instructions: ['Season cooked lentils with cumin, paprika, chili powder, and salt.', 'Make salsa: combine corn, tomatoes, cilantro, and lime juice.', 'Warm tortillas and fill with lentils, salsa, and cabbage.'],
    tags: ['mexican', 'vegan', 'high-fiber', 'quick'],
  },
  {
    id: 'l03', name: 'Pasta e Fagioli', cuisine: 'italian', type: 'lunch',
    caloriesPerServing: 380, proteinPerServing: 17, carbsPerServing: 56, fatPerServing: 9,
    servingSize: '1 bowl', prepTime: 25, weekdayFriendly: true,
    ingredients: ['½ cup small pasta (ditalini or elbow)', '1 can (400g) white cannellini beans, drained', '1 can (400g) crushed tomatoes', '2 stalks celery, diced; 1 carrot, diced', '2 cups vegetable broth', '1 sprig rosemary, 1 tsp dried thyme, olive oil, salt & pepper'],
    instructions: ['Sauté celery and carrot in olive oil 4 minutes.', 'Add crushed tomatoes, broth, beans, rosemary, and thyme. Simmer 10 minutes.', 'Add pasta and cook per package directions until al dente.', 'Season, remove rosemary, and serve with a drizzle of olive oil.'],
    tags: ['italian', 'hearty', 'high-fiber', 'cozy'],
  },
  {
    id: 'l04', name: 'Chana Masala with Brown Rice (Jain-style)', cuisine: 'indian', type: 'lunch',
    caloriesPerServing: 420, proteinPerServing: 16, carbsPerServing: 62, fatPerServing: 10,
    servingSize: '1 plate', prepTime: 25, weekdayFriendly: true,
    ingredients: ['1 can (400g) chickpeas, drained', '2 tomatoes, chopped (or 1 can crushed)', '1 tsp grated ginger, 1 tsp cumin, 1 tsp coriander, ½ tsp turmeric', '½ tsp garam masala, ½ tsp chili powder, pinch asafoetida', '1 tbsp oil, fresh coriander to garnish', '½ cup cooked brown rice'],
    instructions: ['Heat oil; add asafoetida and cumin until fragrant. Add ginger; sauté 1 min.', 'Add tomatoes and spices; cook until oil separates (8 min).', 'Add chickpeas and ½ cup water; simmer 8 minutes. Top with garam masala.', 'Garnish with coriander and serve over brown rice.'],
    tags: ['indian', 'jain-style', 'vegan', 'high-fiber'],
  },
  {
    id: 'l05', name: 'Greek Chickpea Salad with Feta', cuisine: 'greek', type: 'lunch',
    caloriesPerServing: 360, proteinPerServing: 16, carbsPerServing: 38, fatPerServing: 16,
    servingSize: '1 large bowl', prepTime: 10, weekdayFriendly: true,
    ingredients: ['1 can (400g) chickpeas, drained', '1 cucumber, diced', '1 cup cherry tomatoes, halved', '¼ cup Kalamata olives', '¼ cup crumbled feta', '2 tbsp olive oil, juice of 1 lemon, 1 tsp dried oregano, salt & pepper'],
    instructions: ['Combine chickpeas, cucumber, tomatoes, and olives in a bowl.', 'Whisk olive oil, lemon juice, oregano, salt, and pepper for dressing.', 'Toss salad with dressing and top with feta.'],
    tags: ['greek', 'no-cook', 'quick', 'refreshing'],
  },
  {
    id: 'l06', name: 'Palak Dal Soup (Jain-style)', cuisine: 'indian', type: 'lunch',
    caloriesPerServing: 320, proteinPerServing: 18, carbsPerServing: 40, fatPerServing: 7,
    servingSize: '1 bowl + 1 roti', prepTime: 25, weekdayFriendly: true,
    ingredients: ['½ cup yellow moong or masoor dal', '2 cups baby spinach', '1 tomato, chopped', '1 tsp grated ginger, 1 tsp cumin, ½ tsp turmeric, pinch asafoetida', '1 cup vegetable broth, 1 tsp oil, juice of ½ lemon'],
    instructions: ['Cook dal in broth until soft (15 min). Mash lightly.', 'In separate pan, heat oil; add asafoetida, cumin, ginger, and tomato. Cook 5 min.', 'Combine dal with tomato mixture; stir in spinach until wilted.', 'Add lemon juice and serve.'],
    tags: ['indian', 'jain-style', 'high-protein', 'warming'],
  },
  {
    id: 'l07', name: 'Caprese Salad with White Beans', cuisine: 'italian', type: 'lunch',
    caloriesPerServing: 350, proteinPerServing: 19, carbsPerServing: 28, fatPerServing: 16,
    servingSize: '1 plate', prepTime: 10, weekdayFriendly: true,
    ingredients: ['1 can (400g) white beans (cannellini), drained', '200g fresh mozzarella, sliced', '2 large tomatoes, sliced', '¼ cup fresh basil leaves', '2 tbsp extra virgin olive oil', '1 tbsp balsamic glaze, salt & black pepper'],
    instructions: ['Arrange tomato and mozzarella slices alternating on a plate.', 'Spoon white beans alongside.', 'Scatter basil, drizzle olive oil and balsamic glaze, season and serve.'],
    tags: ['italian', 'no-cook', 'elegant', 'quick'],
  },
  {
    id: 'l08', name: 'Rajma (Kidney Bean Curry) with Rice (Jain-style)', cuisine: 'indian', type: 'lunch',
    caloriesPerServing: 440, proteinPerServing: 17, carbsPerServing: 66, fatPerServing: 10,
    servingSize: '1 bowl', prepTime: 25, weekdayFriendly: true,
    ingredients: ['1 can (400g) kidney beans, drained', '2 tomatoes, blended or finely chopped', '1 tsp grated ginger, 1 tsp cumin, 1 tsp coriander, ½ tsp turmeric, pinch asafoetida', '½ tsp garam masala, 1 tbsp oil', '½ cup cooked basmati rice, fresh coriander'],
    instructions: ['Heat oil; add asafoetida and cumin. Add ginger; cook 1 min.', 'Add tomato purée and spices; cook until thickened (8 min).', 'Add beans and ½ cup water; simmer 10 min. Finish with garam masala.', 'Serve over rice with fresh coriander.'],
    tags: ['indian', 'jain-style', 'comfort-food', 'high-fiber'],
  },
  {
    id: 'l09', name: 'Mexican Quinoa Salad', cuisine: 'mexican', type: 'lunch',
    caloriesPerServing: 380, proteinPerServing: 16, carbsPerServing: 48, fatPerServing: 13,
    servingSize: '1 bowl', prepTime: 15, weekdayFriendly: true,
    ingredients: ['½ cup quinoa, cooked and cooled', '½ can black beans, drained', '½ cup corn', '½ cup cherry tomatoes, halved', '½ avocado, cubed', '2 tbsp olive oil, juice of 1 lime, 1 tsp cumin, fresh cilantro, salt'],
    instructions: ['Combine quinoa, beans, corn, tomatoes, and avocado.', 'Whisk together olive oil, lime juice, cumin, and salt.', 'Toss with dressing and fresh cilantro. Serve at room temperature.'],
    tags: ['mexican', 'vegan', 'meal-prep', 'high-fiber'],
  },
  {
    id: 'l10', name: 'Whole Wheat Pasta with Marinara & Ricotta', cuisine: 'italian', type: 'lunch',
    caloriesPerServing: 420, proteinPerServing: 20, carbsPerServing: 56, fatPerServing: 12,
    servingSize: '1 bowl', prepTime: 20, weekdayFriendly: true,
    ingredients: ['80g whole wheat penne', '½ cup part-skim ricotta', '1 can (400g) crushed tomatoes', '1 tsp dried basil, 1 tsp dried oregano, ½ tsp red pepper flakes', '1 tbsp olive oil, salt & pepper, fresh basil to garnish'],
    instructions: ['Cook pasta per package. While cooking, simmer crushed tomatoes with olive oil and herbs 10 min.', 'Drain pasta and toss with sauce.', 'Serve topped with dollops of ricotta and fresh basil.'],
    tags: ['italian', 'quick', 'satisfying', 'high-protein'],
  },
  {
    id: 'l11', name: 'Ginger Sesame Tofu Stir-Fry Bowl', cuisine: 'asian', type: 'lunch',
    caloriesPerServing: 395, proteinPerServing: 22, carbsPerServing: 44, fatPerServing: 14,
    servingSize: '1 bowl', prepTime: 20, weekdayFriendly: true,
    ingredients: ['200g firm tofu, pressed and cubed', '1 cup broccoli florets', '1 red bell pepper, sliced', '1 carrot, julienned', '½ cup brown rice, cooked', '2 tbsp soy sauce, 1 tbsp sesame oil, 1 tsp grated ginger, 1 tsp honey, sesame seeds'],
    instructions: ['Sauté tofu in sesame oil over medium-high heat until golden on all sides (6–8 min).', 'Add vegetables and stir-fry 4 minutes until tender-crisp.', 'Mix soy sauce, ginger, and honey; pour over. Toss and cook 2 more minutes.', 'Serve over brown rice, sprinkle sesame seeds.'],
    tags: ['asian', 'high-protein', 'vegan', 'colorful'],
  },
  {
    id: 'l12', name: 'Mediterranean Lentil Soup', cuisine: 'mediterranean', type: 'lunch',
    caloriesPerServing: 340, proteinPerServing: 18, carbsPerServing: 48, fatPerServing: 7,
    servingSize: '1 bowl', prepTime: 25, weekdayFriendly: true,
    ingredients: ['½ cup red lentils', '1 carrot, diced; 2 stalks celery, diced', '1 can (400g) diced tomatoes', '3 cups vegetable broth', '1 tsp cumin, ½ tsp turmeric, ½ tsp smoked paprika', '1 tbsp olive oil, juice of ½ lemon, fresh parsley'],
    instructions: ['Sauté carrot and celery in olive oil 4 minutes.', 'Add spices, lentils, tomatoes, and broth. Bring to boil.', 'Simmer 15 min until lentils are very soft. Blend partially if desired.', 'Add lemon juice and top with parsley.'],
    tags: ['mediterranean', 'vegan', 'high-fiber', 'cozy'],
  },
  {
    id: 'l13', name: 'Mexican Quinoa Stuffed Peppers', cuisine: 'mexican', type: 'lunch',
    caloriesPerServing: 370, proteinPerServing: 15, carbsPerServing: 46, fatPerServing: 12,
    servingSize: '2 pepper halves', prepTime: 25, weekdayFriendly: true,
    ingredients: ['2 large bell peppers, halved and seeds removed', '½ cup quinoa, cooked', '½ can black beans, drained', '½ cup corn, ½ cup salsa', '¼ cup shredded cheese', '1 tsp cumin, fresh cilantro'],
    instructions: ['Mix quinoa, beans, corn, salsa, and cumin.', 'Fill pepper halves with mixture and top with cheese.', 'Bake 20 min at 200°C or microwave 6 min until peppers are tender.', 'Garnish with cilantro and serve.'],
    tags: ['mexican', 'colorful', 'meal-prep', 'filling'],
  },
  {
    id: 'l14', name: 'Saag Paneer Salad (Jain-style)', cuisine: 'indian', type: 'lunch',
    caloriesPerServing: 360, proteinPerServing: 22, carbsPerServing: 14, fatPerServing: 24,
    servingSize: '1 large plate', prepTime: 20, weekdayFriendly: true,
    ingredients: ['150g paneer, cubed and pan-fried golden', '2 cups baby spinach', '1 cup cooked chickpeas', '1 tomato, diced', '2 tbsp tahini, juice of 1 lemon, 1 tsp cumin powder, salt', 'Fresh coriander, pomegranate seeds (optional)'],
    instructions: ['Pan-fry paneer cubes until golden in a dry or lightly oiled pan.', 'Make dressing: whisk tahini, lemon juice, cumin, and salt.', 'Toss spinach, chickpeas, tomato, and paneer with dressing.', 'Garnish with coriander and pomegranate if using.'],
    tags: ['indian', 'jain-style', 'high-protein', 'salad'],
  },
  {
    id: 'l15', name: 'White Bean & Vegetable Minestrone', cuisine: 'italian', type: 'lunch',
    caloriesPerServing: 360, proteinPerServing: 17, carbsPerServing: 50, fatPerServing: 8,
    servingSize: '1 bowl', prepTime: 25, weekdayFriendly: true,
    ingredients: ['1 can (400g) white beans, drained', '1 zucchini, diced; 1 carrot, diced; 2 stalks celery', '½ cup small pasta or broken spaghetti', '1 can (400g) diced tomatoes, 3 cups vegetable broth', '1 tsp dried basil, 1 tsp dried oregano, 2 tbsp olive oil'],
    instructions: ['Sauté celery and carrot in olive oil 4 minutes.', 'Add tomatoes, broth, zucchini, herbs, and beans. Simmer 10 minutes.', 'Add pasta and cook 8 minutes until tender.', 'Season and serve with a drizzle of olive oil.'],
    tags: ['italian', 'hearty', 'vegan', 'meal-prep'],
  },
  {
    id: 'l16', name: 'Veggie Burrito with Black Beans', cuisine: 'mexican', type: 'lunch',
    caloriesPerServing: 430, proteinPerServing: 17, carbsPerServing: 58, fatPerServing: 14,
    servingSize: '1 burrito', prepTime: 15, weekdayFriendly: true,
    ingredients: ['1 large whole wheat tortilla', '½ can black beans, warmed with cumin & chili powder', '½ cup cooked brown rice', '¼ avocado, mashed', '¼ cup salsa, 2 tbsp sour cream, ¼ cup shredded cheese'],
    instructions: ['Warm the tortilla in a dry pan or microwave.', 'Layer rice, beans, avocado, salsa, sour cream, and cheese on the tortilla.', 'Fold sides in and roll tightly. Toast seam-side down in pan 1 min if desired.'],
    tags: ['mexican', 'quick', 'filling', 'portable'],
  },
  {
    id: 'l17', name: 'Aloo Gobi with Roti (Jain-style)', cuisine: 'indian', type: 'lunch',
    caloriesPerServing: 380, proteinPerServing: 11, carbsPerServing: 54, fatPerServing: 13,
    servingSize: '1 plate + 2 rotis', prepTime: 25, weekdayFriendly: true,
    ingredients: ['1 medium potato, cubed', '1 cup cauliflower florets', '1 tomato, chopped', '1 tsp cumin, ½ tsp turmeric, 1 tsp coriander powder, pinch asafoetida', '1 tsp grated ginger, 1 tbsp oil, salt & coriander leaves', '2 whole wheat rotis'],
    instructions: ['Heat oil; add cumin and asafoetida. Add ginger and tomato; cook 4 min.', 'Add potato, cauliflower, turmeric, coriander powder, and salt with a splash of water.', 'Cover and cook on medium-low 12–15 min until vegetables are tender.', 'Garnish with coriander. Serve with rotis.'],
    tags: ['indian', 'jain-style', 'vegan', 'comfort-food'],
  },
  {
    id: 'l18', name: 'Tahini Quinoa Buddha Bowl', cuisine: 'mediterranean', type: 'lunch',
    caloriesPerServing: 400, proteinPerServing: 17, carbsPerServing: 48, fatPerServing: 16,
    servingSize: '1 bowl', prepTime: 20, weekdayFriendly: true,
    ingredients: ['½ cup quinoa, cooked', '1 cup roasted chickpeas (canned, tossed in olive oil + paprika, roasted 20 min)', '1 cup mixed greens', '½ cucumber, sliced', '½ cup cherry tomatoes', '3 tbsp tahini, juice of 1 lemon, 2 tbsp water, salt'],
    instructions: ['Roast chickpeas: toss with olive oil and paprika, bake 200°C for 20 min.', 'Make dressing: whisk tahini, lemon, water, and salt until smooth.', 'Assemble bowl with quinoa, greens, cucumber, tomatoes, and chickpeas.', 'Drizzle generously with tahini dressing.'],
    tags: ['mediterranean', 'vegan', 'high-protein', 'colorful'],
  },

  // ─── DINNERS (18) ───────────────────────────────────────────────────────────
  {
    id: 'd01', name: 'Black Bean Enchiladas Verdes', cuisine: 'mexican', type: 'dinner',
    caloriesPerServing: 460, proteinPerServing: 22, carbsPerServing: 56, fatPerServing: 16,
    servingSize: '2 enchiladas', prepTime: 35, weekdayFriendly: false,
    ingredients: ['4 corn tortillas', '1 can (400g) black beans, drained', '1 cup shredded Monterey Jack or mozzarella', '1 cup tomatillo salsa (store-bought)', '½ cup Greek yogurt or sour cream', '1 tsp cumin, ½ tsp smoked paprika, fresh cilantro'],
    instructions: ['Preheat oven 190°C. Mix beans with cumin and paprika.', 'Warm tortillas. Fill each with beans and cheese, roll, and place seam-down in baking dish.', 'Pour tomatillo salsa over enchiladas, top with remaining cheese.', 'Bake 20 min until bubbly. Serve with sour cream and cilantro.'],
    tags: ['mexican', 'baked', 'cheesy', 'high-protein'],
  },
  {
    id: 'd02', name: 'Palak Paneer with Naan (Jain-style)', cuisine: 'indian', type: 'dinner',
    caloriesPerServing: 480, proteinPerServing: 26, carbsPerServing: 38, fatPerServing: 22,
    servingSize: '1 plate + naan', prepTime: 30, weekdayFriendly: true,
    ingredients: ['200g paneer, cubed', '300g baby spinach', '2 tomatoes, chopped', '3 tbsp heavy cream or cashew cream', '1 tsp cumin, 1 tsp coriander, ½ tsp turmeric, ½ tsp garam masala, pinch asafoetida', '1 tsp grated ginger, 1 tbsp oil, 1 whole wheat naan'],
    instructions: ['Blanch spinach 2 min; drain and blend to smooth purée.', 'Heat oil; add asafoetida, ginger, and tomatoes. Cook until pulpy (8 min). Add spices.', 'Add spinach purée and simmer 5 min. Add paneer and cream; cook 5 more minutes.', 'Serve with warm naan.'],
    tags: ['indian', 'jain-style', 'high-protein', 'restaurant-quality'],
  },
  {
    id: 'd03', name: 'Lentil Bolognese with Whole Wheat Pasta', cuisine: 'italian', type: 'dinner',
    caloriesPerServing: 460, proteinPerServing: 24, carbsPerServing: 62, fatPerServing: 10,
    servingSize: '1 plate', prepTime: 35, weekdayFriendly: false,
    ingredients: ['80g whole wheat spaghetti', '1 cup red lentils', '1 can (400g) crushed tomatoes', '1 carrot, finely diced; 2 stalks celery, diced', '1 cup vegetable broth', '1 tsp dried basil, 1 tsp oregano, 1 bay leaf, 2 tbsp olive oil, parmesan to serve'],
    instructions: ['Cook pasta. Meanwhile, sauté carrot and celery in olive oil 4 min.', 'Add lentils, tomatoes, broth, herbs, and bay leaf. Simmer 20 min until lentils break down.', 'Season sauce and toss with pasta.', 'Top with parmesan.'],
    tags: ['italian', 'vegan', 'high-protein', 'comfort-food'],
  },
  {
    id: 'd04', name: 'Chana Saag (Jain-style)', cuisine: 'indian', type: 'dinner',
    caloriesPerServing: 400, proteinPerServing: 17, carbsPerServing: 46, fatPerServing: 14,
    servingSize: '1 bowl + rice', prepTime: 30, weekdayFriendly: true,
    ingredients: ['1 can (400g) chickpeas, drained', '300g baby spinach, roughly chopped', '2 tomatoes, puréed', '1 tsp grated ginger, 1 tsp cumin, 1 tsp coriander, ½ tsp garam masala, pinch asafoetida', '3 tbsp plain yogurt, 1 tbsp oil, ½ cup cooked rice'],
    instructions: ['Heat oil; add asafoetida and cumin. Add ginger and tomato purée; cook 8 min.', 'Add spices, chickpeas, and ½ cup water; simmer 10 min.', 'Stir in spinach until wilted. Remove from heat, stir in yogurt.', 'Finish with garam masala; serve over rice.'],
    tags: ['indian', 'jain-style', 'vegan-friendly', 'filling'],
  },
  {
    id: 'd05', name: 'Eggplant Parmesan', cuisine: 'italian', type: 'dinner',
    caloriesPerServing: 420, proteinPerServing: 20, carbsPerServing: 34, fatPerServing: 22,
    servingSize: '1 serving', prepTime: 45, weekdayFriendly: false,
    ingredients: ['1 large eggplant, sliced into 1cm rounds', '1 can (400g) crushed tomatoes with basil', '1 cup shredded mozzarella', '¼ cup grated parmesan', '½ cup panko breadcrumbs, 1 tbsp dried oregano', '2 tbsp olive oil, salt, fresh basil'],
    instructions: ['Salt eggplant slices, rest 10 min, pat dry. Brush with olive oil and breadcrumbs.', 'Bake eggplant 200°C for 20 min, flipping once, until golden.', 'Layer in baking dish: tomato sauce, eggplant, mozzarella; repeat. Top with parmesan.', 'Bake 15 min until bubbly. Garnish with fresh basil.'],
    tags: ['italian', 'baked', 'cheesy', 'vegetarian-classic'],
  },
  {
    id: 'd06', name: 'Dal Makhani with Rice (Jain-style)', cuisine: 'indian', type: 'dinner',
    caloriesPerServing: 460, proteinPerServing: 19, carbsPerServing: 58, fatPerServing: 16,
    servingSize: '1 bowl + ½ cup rice', prepTime: 40, weekdayFriendly: false,
    ingredients: ['½ cup whole black urad dal, soaked overnight', '¼ cup kidney beans, soaked overnight', '2 tomatoes, puréed', '3 tbsp butter', '3 tbsp heavy cream', '1 tsp grated ginger, 1 tsp cumin, ½ tsp garam masala, pinch asafoetida, salt'],
    instructions: ['Pressure cook or slow-boil soaked dal and beans until very soft (30–40 min).', 'In pan, heat butter with asafoetida and cumin. Add ginger and tomato purée; cook 10 min.', 'Combine with cooked dal; simmer 10 min. Stir in cream and garam masala.', 'Serve over basmati rice.'],
    tags: ['indian', 'jain-style', 'creamy', 'special-occasion'],
  },
  {
    id: 'd07', name: 'White Bean Pasta with Roasted Vegetables', cuisine: 'italian', type: 'dinner',
    caloriesPerServing: 440, proteinPerServing: 21, carbsPerServing: 56, fatPerServing: 14,
    servingSize: '1 plate', prepTime: 30, weekdayFriendly: true,
    ingredients: ['80g whole wheat rigatoni', '1 can (400g) white cannellini beans', '1 zucchini and 1 red bell pepper, roasted at 200°C with olive oil', '½ cup cherry tomatoes', '1 tbsp olive oil, 1 tsp dried rosemary, parmesan & fresh basil to serve'],
    instructions: ['Roast zucchini and bell pepper with olive oil and rosemary at 200°C, 20 min.', 'Cook pasta. Add cherry tomatoes to pan in last 5 min.', 'Drain pasta, toss with beans, roasted vegetables, and olive oil.', 'Finish with parmesan and fresh basil.'],
    tags: ['italian', 'simple', 'high-fiber', 'colorful'],
  },
  {
    id: 'd08', name: 'Vegetarian Pozole Rojo', cuisine: 'mexican', type: 'dinner',
    caloriesPerServing: 390, proteinPerServing: 15, carbsPerServing: 60, fatPerServing: 9,
    servingSize: '1 large bowl', prepTime: 35, weekdayFriendly: false,
    ingredients: ['1 can (400g) white hominy, drained', '1 can (400g) black beans', '2 dried ancho or guajillo chilis, rehydrated and blended', '2 tomatoes, blended', '3 cups vegetable broth', '1 tsp cumin, 1 tsp dried oregano, salt; shredded cabbage, lime to serve'],
    instructions: ['Toast dried chilis in dry pan 1 min, then soak in boiling water 15 min. Blend with tomatoes.', 'Simmer chili-tomato sauce in broth 10 min with cumin and oregano.', 'Add hominy and beans; simmer 15 min.', 'Serve with cabbage and lime.'],
    tags: ['mexican', 'soup', 'vegan', 'comforting'],
  },
  {
    id: 'd09', name: 'Kadai Paneer with Roti (Jain-style)', cuisine: 'indian', type: 'dinner',
    caloriesPerServing: 490, proteinPerServing: 28, carbsPerServing: 36, fatPerServing: 26,
    servingSize: '1 plate + 2 rotis', prepTime: 35, weekdayFriendly: false,
    ingredients: ['250g paneer, cubed', '2 bell peppers (red & green), cubed', '3 tomatoes, chopped', '1 tsp cumin seeds, 1 tsp coriander powder, ½ tsp garam masala, pinch asafoetida', '1 tsp grated ginger, 1 tbsp oil', '2 whole wheat rotis, fresh coriander'],
    instructions: ['Heat oil; add cumin and asafoetida. Add ginger and tomatoes; cook until thick (10 min).', 'Add coriander powder and bell peppers; cook 5 min.', 'Add paneer and garam masala; cook 5 more minutes.', 'Garnish with coriander and serve with rotis.'],
    tags: ['indian', 'jain-style', 'high-protein', 'restaurant-style'],
  },
  {
    id: 'd10', name: 'Asparagus & Parmesan Risotto', cuisine: 'italian', type: 'dinner',
    caloriesPerServing: 460, proteinPerServing: 18, carbsPerServing: 58, fatPerServing: 16,
    servingSize: '1 bowl', prepTime: 40, weekdayFriendly: false,
    ingredients: ['½ cup arborio rice', '1 bunch asparagus, trimmed and cut into pieces', '3 cups warm vegetable broth', '¼ cup dry white wine (or extra broth)', '¼ cup grated parmesan', '2 tbsp butter, 1 tbsp olive oil, salt, white pepper, fresh lemon zest'],
    instructions: ['Toast arborio in olive oil 2 min. Add wine and stir until absorbed.', 'Add warm broth ladle by ladle, stirring constantly until each is absorbed (20 min).', 'In last 5 min, stir in asparagus. When creamy and al dente, remove from heat.', 'Stir in butter and parmesan. Season and top with lemon zest.'],
    tags: ['italian', 'creamy', 'elegant', 'weekend'],
  },
  {
    id: 'd11', name: 'Stuffed Poblano Peppers with Rice & Beans', cuisine: 'mexican', type: 'dinner',
    caloriesPerServing: 420, proteinPerServing: 18, carbsPerServing: 52, fatPerServing: 14,
    servingSize: '2 stuffed peppers', prepTime: 40, weekdayFriendly: false,
    ingredients: ['4 poblano peppers, halved', '½ cup brown rice, cooked', '½ can black beans', '½ cup corn', '½ cup salsa + ¼ cup shredded cheese', '1 tsp cumin, fresh cilantro'],
    instructions: ['Preheat oven 200°C. Mix rice, beans, corn, salsa, and cumin.', 'Fill pepper halves generously with rice mixture. Top with cheese.', 'Bake 25 min until peppers are tender and cheese is golden.', 'Garnish with cilantro.'],
    tags: ['mexican', 'baked', 'colorful', 'meal-prep'],
  },
  {
    id: 'd12', name: 'Aloo Matar Curry with Rice (Jain-style)', cuisine: 'indian', type: 'dinner',
    caloriesPerServing: 400, proteinPerServing: 12, carbsPerServing: 62, fatPerServing: 11,
    servingSize: '1 plate', prepTime: 30, weekdayFriendly: true,
    ingredients: ['2 medium potatoes, cubed', '1 cup frozen peas', '2 tomatoes, chopped', '1 tsp cumin, ½ tsp turmeric, 1 tsp coriander, ½ tsp garam masala, pinch asafoetida', '1 tsp grated ginger, 1 tbsp oil', '½ cup cooked rice, fresh coriander'],
    instructions: ['Heat oil with asafoetida and cumin. Add ginger and tomatoes; cook 6 min.', 'Add potatoes, spices, and 1 cup water. Cover and cook 12 min.', 'Add peas and finish with garam masala; cook 5 more minutes.', 'Garnish with coriander and serve with rice.'],
    tags: ['indian', 'jain-style', 'vegan', 'budget-friendly'],
  },
  {
    id: 'd13', name: 'Pasta Primavera', cuisine: 'italian', type: 'dinner',
    caloriesPerServing: 430, proteinPerServing: 17, carbsPerServing: 56, fatPerServing: 14,
    servingSize: '1 plate', prepTime: 25, weekdayFriendly: true,
    ingredients: ['80g whole wheat linguine or penne', '1 zucchini, thinly sliced', '1 red bell pepper, strips', '½ cup cherry tomatoes, halved', '½ cup fresh or frozen peas', '¼ cup parmesan, 2 tbsp olive oil, 1 tsp Italian seasoning, fresh basil, salt & pepper'],
    instructions: ['Cook pasta. While cooking, sauté zucchini and bell pepper in olive oil 4 min.', 'Add cherry tomatoes and peas; cook 3 more minutes.', 'Drain pasta, toss with vegetables, Italian seasoning, and olive oil.', 'Top with parmesan and fresh basil.'],
    tags: ['italian', 'light', 'quick', 'colorful'],
  },
  {
    id: 'd14', name: 'Thai Green Curry with Tofu & Vegetables', cuisine: 'asian', type: 'dinner',
    caloriesPerServing: 440, proteinPerServing: 20, carbsPerServing: 46, fatPerServing: 18,
    servingSize: '1 bowl', prepTime: 30, weekdayFriendly: true,
    ingredients: ['200g firm tofu, cubed', '1 can (400ml) light coconut milk', '2 tbsp Thai green curry paste (vegan)', '1 cup broccoli, 1 red bell pepper, 1 zucchini (all diced)', '½ cup cooked jasmine rice', '1 tbsp soy sauce, 1 tsp lime juice, fresh basil or Thai basil'],
    instructions: ['Fry tofu in lightly oiled pan until golden; set aside.', 'Cook curry paste in same pan 1 min. Add coconut milk and bring to simmer.', 'Add vegetables and tofu; simmer 8–10 min until vegetables are tender.', 'Season with soy sauce and lime. Serve over rice with fresh basil.'],
    tags: ['asian', 'vegan', 'creamy', 'aromatic'],
  },
  {
    id: 'd15', name: 'Smoky Black Bean Soup', cuisine: 'mexican', type: 'dinner',
    caloriesPerServing: 380, proteinPerServing: 17, carbsPerServing: 54, fatPerServing: 8,
    servingSize: '1 bowl', prepTime: 30, weekdayFriendly: true,
    ingredients: ['2 cans (800g) black beans', '1 can (400g) diced tomatoes', '3 cups vegetable broth', '1 chipotle pepper in adobo + 1 tsp adobo sauce (or ½ tsp smoked paprika)', '1 tsp cumin, 1 tsp coriander, juice of 1 lime', 'Sour cream, cilantro, lime wedges to serve'],
    instructions: ['Blend 1 can of beans until smooth; combine with whole beans, tomatoes, and broth.', 'Add chipotle, cumin, and coriander; simmer 15 min.', 'Add lime juice. Season and serve with sour cream, cilantro.'],
    tags: ['mexican', 'smoky', 'vegan', 'high-fiber'],
  },
  {
    id: 'd16', name: 'Paneer Tikka Masala (Jain-style)', cuisine: 'indian', type: 'dinner',
    caloriesPerServing: 500, proteinPerServing: 30, carbsPerServing: 32, fatPerServing: 28,
    servingSize: '1 plate + naan', prepTime: 35, weekdayFriendly: false,
    ingredients: ['250g paneer, cubed', '3 tomatoes, puréed or 1 can crushed tomatoes', '¼ cup plain yogurt', '3 tbsp heavy cream', '1 tsp grated ginger, 1 tsp cumin, 1 tsp coriander, 1 tsp garam masala, ½ tsp turmeric, pinch asafoetida', '1 tbsp butter, 1 whole wheat naan'],
    instructions: ['Marinate paneer in yogurt + turmeric + cumin 15 min. Pan-fry until golden; set aside.', 'Melt butter; add asafoetida and ginger. Add tomatoes and spices; cook 10 min.', 'Add cream and paneer; simmer 8 min until rich and saucy.', 'Serve with warm naan.'],
    tags: ['indian', 'jain-style', 'indulgent', 'restaurant-quality'],
  },
  {
    id: 'd17', name: 'Greek Stuffed Peppers with Feta & Quinoa', cuisine: 'greek', type: 'dinner',
    caloriesPerServing: 420, proteinPerServing: 18, carbsPerServing: 46, fatPerServing: 18,
    servingSize: '2 stuffed peppers', prepTime: 40, weekdayFriendly: false,
    ingredients: ['4 bell peppers (any color), halved', '½ cup quinoa, cooked', '½ can chickpeas, drained', '½ cup crumbled feta', '½ cup cherry tomatoes, halved; ¼ cup Kalamata olives', '2 tbsp olive oil, 1 tsp dried oregano, fresh parsley'],
    instructions: ['Preheat oven 190°C. Mix quinoa, chickpeas, feta, tomatoes, olives, oregano, and olive oil.', 'Fill pepper halves with quinoa mixture.', 'Bake 30 min until peppers are tender and top is lightly golden.', 'Garnish with fresh parsley and a drizzle of olive oil.'],
    tags: ['greek', 'mediterranean', 'baked', 'elegant'],
  },
  {
    id: 'd18', name: 'Moroccan Chickpea & Sweet Potato Stew', cuisine: 'moroccan', type: 'dinner',
    caloriesPerServing: 420, proteinPerServing: 16, carbsPerServing: 62, fatPerServing: 10,
    servingSize: '1 bowl + couscous', prepTime: 30, weekdayFriendly: true,
    ingredients: ['1 can (400g) chickpeas, drained', '1 medium sweet potato, cubed', '1 can (400g) diced tomatoes', '2 cups vegetable broth', '1 tsp cumin, 1 tsp coriander, ½ tsp cinnamon, ½ tsp smoked paprika', '½ cup couscous, juice of ½ lemon, fresh coriander or parsley'],
    instructions: ['Simmer sweet potato in broth 8 min until starting to soften.', 'Add chickpeas, tomatoes, and spices; simmer 15 min.', 'Meanwhile, pour boiling water over couscous (1:1.5 ratio), cover 5 min, fluff.', 'Add lemon juice to stew. Serve over couscous with herbs.'],
    tags: ['moroccan', 'vegan', 'aromatic', 'warming'],
  },

  // ─── SNACKS (10) ────────────────────────────────────────────────────────────
  {
    id: 's01', name: 'Apple with Almond Butter', cuisine: 'american', type: 'snack',
    caloriesPerServing: 200, proteinPerServing: 5, carbsPerServing: 28, fatPerServing: 9,
    servingSize: '1 apple + 2 tbsp almond butter', prepTime: 2, weekdayFriendly: true,
    ingredients: ['1 medium apple, sliced', '2 tbsp almond butter'],
    instructions: ['Slice apple and serve with almond butter for dipping.'],
    tags: ['snack', 'no-cook', 'quick'],
  },
  {
    id: 's02', name: 'Greek Yogurt with Honey & Walnuts', cuisine: 'greek', type: 'snack',
    caloriesPerServing: 180, proteinPerServing: 14, carbsPerServing: 16, fatPerServing: 7,
    servingSize: '¾ cup', prepTime: 2, weekdayFriendly: true,
    ingredients: ['¾ cup plain Greek yogurt', '1 tsp honey', '1 tbsp chopped walnuts'],
    instructions: ['Top yogurt with honey and walnuts.'],
    tags: ['high-protein', 'no-cook', 'quick'],
  },
  {
    id: 's03', name: 'Hummus with Veggie Sticks', cuisine: 'mediterranean', type: 'snack',
    caloriesPerServing: 170, proteinPerServing: 7, carbsPerServing: 18, fatPerServing: 8,
    servingSize: '¼ cup hummus + veggies', prepTime: 5, weekdayFriendly: true,
    ingredients: ['¼ cup store-bought hummus', '1 cup sliced bell peppers, cucumber & carrot'],
    instructions: ['Slice vegetables and serve with hummus.'],
    tags: ['vegan', 'no-cook', 'crunchy'],
  },
  {
    id: 's04', name: 'Mixed Nuts & Dried Mango', cuisine: 'american', type: 'snack',
    caloriesPerServing: 190, proteinPerServing: 5, carbsPerServing: 20, fatPerServing: 11,
    servingSize: '¼ cup mix', prepTime: 1, weekdayFriendly: true,
    ingredients: ['2 tbsp mixed nuts (almonds, cashews, pecans)', '2 tbsp dried mango pieces'],
    instructions: ['Combine and portion into a small container.'],
    tags: ['portable', 'energy-dense', 'no-cook'],
  },
  {
    id: 's05', name: 'Protein Shake', cuisine: 'american', type: 'snack',
    caloriesPerServing: 200, proteinPerServing: 24, carbsPerServing: 14, fatPerServing: 4,
    servingSize: '1 shake', prepTime: 3, weekdayFriendly: true,
    ingredients: ['1 scoop protein powder', '1 cup almond milk', '½ banana or berries', 'Ice'],
    instructions: ['Blend all ingredients until smooth.'],
    tags: ['high-protein', 'quick', 'post-workout'],
  },
  {
    id: 's06', name: 'Cottage Cheese with Cucumber & Herbs', cuisine: 'american', type: 'snack',
    caloriesPerServing: 120, proteinPerServing: 16, carbsPerServing: 6, fatPerServing: 3,
    servingSize: '½ cup', prepTime: 3, weekdayFriendly: true,
    ingredients: ['½ cup low-fat cottage cheese', '½ cucumber sliced', 'Fresh dill', 'Salt & pepper'],
    instructions: ['Top cottage cheese with cucumber and herbs.'],
    tags: ['high-protein', 'low-carb', 'no-cook'],
  },
  {
    id: 's07', name: 'Edamame with Sea Salt', cuisine: 'asian', type: 'snack',
    caloriesPerServing: 130, proteinPerServing: 11, carbsPerServing: 10, fatPerServing: 5,
    servingSize: '½ cup shelled', prepTime: 5, weekdayFriendly: true,
    ingredients: ['½ cup frozen edamame, in pods', 'Flaky sea salt'],
    instructions: ['Microwave edamame 3 minutes. Sprinkle with sea salt and eat from pods.'],
    tags: ['high-protein', 'vegan', 'salty'],
  },
  {
    id: 's08', name: 'Roasted Spiced Chickpeas', cuisine: 'mediterranean', type: 'snack',
    caloriesPerServing: 160, proteinPerServing: 8, carbsPerServing: 20, fatPerServing: 5,
    servingSize: '¼ cup', prepTime: 25, weekdayFriendly: false,
    ingredients: ['1 can (400g) chickpeas, drained and dried', '1 tsp olive oil', '½ tsp cumin, ½ tsp paprika, salt'],
    instructions: ['Toss dried chickpeas with olive oil and spices.', 'Roast at 200°C for 25–30 min until crunchy.', 'Cool completely before storing.'],
    tags: ['crunchy', 'meal-prep', 'high-fiber'],
  },
  {
    id: 's09', name: 'Mango Lassi', cuisine: 'indian', type: 'snack',
    caloriesPerServing: 180, proteinPerServing: 7, carbsPerServing: 32, fatPerServing: 3,
    servingSize: '1 glass', prepTime: 5, weekdayFriendly: true,
    ingredients: ['½ cup frozen mango', '½ cup plain low-fat yogurt', '¼ cup almond milk', '1 tsp honey', 'Cardamom powder'],
    instructions: ['Blend all ingredients until smooth and creamy. Serve chilled.'],
    tags: ['indian', 'refreshing', 'no-cook'],
  },
  {
    id: 's10', name: 'Dark Chocolate & Almonds', cuisine: 'american', type: 'snack',
    caloriesPerServing: 160, proteinPerServing: 4, carbsPerServing: 14, fatPerServing: 11,
    servingSize: '1 oz chocolate + 10 almonds', prepTime: 1, weekdayFriendly: true,
    ingredients: ['1 oz dark chocolate (70%+)', '10 raw almonds'],
    instructions: ['Portion and enjoy mindfully.'],
    tags: ['antioxidant-rich', 'satisfying', 'treat'],
  },
];

export const getMealsByType = (type: Meal['type']) => meals.filter(m => m.type === type);

// ── Dietary flags ────────────────────────────────────────────────────────────
// Flags: vegetarian | vegan | gluten-free | dairy-free | allium-free | nut-free | low-carb | keto | halal
// Vegan ⊆ vegetarian. All meals in this app are vegetarian and halal.
// Allium-free = no onion, garlic, leeks, shallots (jain-style meals qualify).
// Low-carb ≤ 25g carbs. Keto ≤ 20g carbs.
const MEAL_DIETARY_FLAGS: Record<string, string[]> = {
  // Breakfasts
  b01: ['vegetarian', 'allium-free', 'halal'],
  b02: ['vegetarian', 'allium-free', 'halal'],
  b03: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  b04: ['vegetarian', 'vegan', 'dairy-free', 'allium-free', 'halal'],
  b05: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'low-carb', 'keto', 'halal'],
  b06: ['vegetarian', 'vegan', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  b07: ['vegetarian', 'vegan', 'dairy-free', 'allium-free', 'halal'],
  b08: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  b09: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'halal'],
  b10: ['vegetarian', 'gluten-free', 'allium-free', 'halal'],
  b11: ['vegetarian', 'gluten-free', 'allium-free', 'low-carb', 'halal'],
  b12: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  b13: ['vegetarian', 'allium-free', 'halal'],
  b14: ['vegetarian', 'dairy-free', 'allium-free', 'halal'],
  b15: ['vegetarian', 'vegan', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  b16: ['vegetarian', 'allium-free', 'halal'],
  b17: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  b18: ['vegetarian', 'dairy-free', 'allium-free', 'halal'],
  // Lunches
  l01: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'halal'],
  l02: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  l03: ['vegetarian', 'vegan', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  l04: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  l05: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'halal'],
  l06: ['vegetarian', 'vegan', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  l07: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'halal'],
  l08: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  l09: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  l10: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  l11: ['vegetarian', 'vegan', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  l12: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  l13: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'halal'],
  l14: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'low-carb', 'keto', 'halal'],
  l15: ['vegetarian', 'vegan', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  l16: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  l17: ['vegetarian', 'vegan', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  l18: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  // Dinners
  d01: ['vegetarian', 'gluten-free', 'nut-free', 'halal'],
  d02: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  d03: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  d04: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'halal'],
  d05: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  d06: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'halal'],
  d07: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  d08: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  d09: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  d10: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'halal'],
  d11: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'halal'],
  d12: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  d13: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  d14: ['vegetarian', 'vegan', 'dairy-free', 'nut-free', 'halal'],
  d15: ['vegetarian', 'gluten-free', 'nut-free', 'halal'],
  d16: ['vegetarian', 'allium-free', 'nut-free', 'halal'],
  d17: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'halal'],
  d18: ['vegetarian', 'vegan', 'dairy-free', 'allium-free', 'nut-free', 'halal'],
  // Snacks
  s01: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'halal'],
  s02: ['vegetarian', 'gluten-free', 'allium-free', 'low-carb', 'keto', 'halal'],
  s03: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'low-carb', 'halal'],
  s04: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'low-carb', 'halal'],
  s05: ['vegetarian', 'gluten-free', 'allium-free', 'low-carb', 'halal'],
  s06: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'low-carb', 'keto', 'halal'],
  s07: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'low-carb', 'keto', 'halal'],
  s08: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'low-carb', 'halal'],
  s09: ['vegetarian', 'gluten-free', 'allium-free', 'nut-free', 'halal'],
  s10: ['vegetarian', 'allium-free', 'low-carb', 'keto', 'halal'],
};

// Known dietary flags supported by meal data
const KNOWN_FLAGS = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'allium-free', 'nut-free', 'low-carb', 'keto', 'halal'];

function toKey(s: string): string {
  return s.toLowerCase().replace(/[\s\-_]+/g, '');
}

// Maps normalized free-form input to a known flag if one matches
function resolveFlag(input: string): string | null {
  const key = toKey(input);
  return KNOWN_FLAGS.find(f => toKey(f) === key) ?? null;
}

export function getMealDietaryFlags(mealId: string): string[] {
  return MEAL_DIETARY_FLAGS[mealId] ?? ['vegetarian', 'halal'];
}

export function mealMatchesRestrictions(meal: Meal, restrictions: string[]): boolean {
  if (!restrictions || restrictions.length === 0) return true;
  const flags = getMealDietaryFlags(meal.id);
  return restrictions.every(r => {
    const flag = resolveFlag(r);
    // If input doesn't match a known dietary flag, we can't auto-filter on it — pass through
    return !flag || flags.includes(flag);
  });
}

export const getWeeklyMealPlan = (weekNumber: number, restrictions: string[] = []) => {
  const compliant = (m: Meal) => mealMatchesRestrictions(m, restrictions);
  const breakfasts = getMealsByType('breakfast').filter(compliant);
  const lunches    = getMealsByType('lunch').filter(compliant);
  const dinners    = getMealsByType('dinner').filter(compliant);
  const snacks     = getMealsByType('snack').filter(compliant);
  // Fallback to unfiltered pool if no compliant options exist for a type
  const bPool = breakfasts.length > 0 ? breakfasts : getMealsByType('breakfast');
  const lPool = lunches.length    > 0 ? lunches    : getMealsByType('lunch');
  const dPool = dinners.length    > 0 ? dinners    : getMealsByType('dinner');
  const sPool = snacks.length     > 0 ? snacks     : getMealsByType('snack');
  return Array.from({ length: 7 }, (_, day) => ({
    day,
    breakfast: bPool[(weekNumber * 7 + day) % bPool.length],
    lunch:     lPool[(weekNumber * 7 + day) % lPool.length],
    dinner:    dPool[(weekNumber * 7 + day) % dPool.length],
    snack:     sPool[(weekNumber * 7 + day) % sPool.length],
  }));
};
