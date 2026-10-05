# Drop your photos here

One folder per category, named exactly like the `slug` in src/data/site.js.
Put the JPGs inside and the site picks them up on the next build — no code
to edit.

    pre-wedding/     ->  Pre Wedding
    wedding/         ->  Wedding Stories
    post-wedding/    ->  Post Wedding
    maternity/       ->  Maternity
    baby/            ->  Baby Shoot            (New Born Baby Shoot)
    pre-birthday/    ->  Pre Birthday Baby
    birthday/        ->  Birthday Event
    family-function/ ->  Family Function
    corporate/       ->  Corporate Event
    food/            ->  Food
    product/         ->  Product
    clothing/        ->  Clothing
    portfolio/       ->  Portfolio Shoot
    interior/        ->  Interior
    banner/          ->  desktop.jpg + mobile.jpg for the homepage banner

Files are used in filename order, so 001.jpg comes first. The first photo
in a folder becomes that category's cover on the homepage and in the
turning case — put the strongest shot first.

Use prepare-photos.ps1 in the project root to resize and copy photos in;
it names them 001.jpg, 002.jpg for you.

## Priority

1. Photos uploaded through /admin
2. These folders
3. The placeholder images in src/data/site.js

As soon as a folder has real photos, the placeholders for that category
disappear on their own.
