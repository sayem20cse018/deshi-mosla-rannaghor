import { RecipesService } from './recipes.service';
export declare class RecipesController {
    private readonly recipesService;
    constructor(recipesService: RecipesService);
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: never[];
    }>;
}
