import {ko, ok} from "../../fp/result.model.ts";
import { isRepository, isService } from "../ddd-rules.utils.ts";

const rule: RuleResult = (dragees: Dragee[]) => {
    const repositoryNames = dragees
        .filter(dragee => isRepository(dragee))
        .map(repository => repository.name)
        
    const drageesWithRepositoryDependencies = dragees
        .map(dragee => {
            
            const repositories: string[]= 
                dragee.depends_on 
                    ? Object.keys(dragee.depends_on).filter(name => repositoryNames.includes(name))
                    : [];
            
            return repositories.map(repository => {
                return {dragee: dragee, repositoryName: repository}
            })
    })
    .flatMap(drageeWithRepo => drageeWithRepo)
    .filter(drageeWithRepo => drageeWithRepo.repositoryName)

    return drageesWithRepositoryDependencies
        .map(drageeWithRepositories => {
            if (isService(drageeWithRepositories.dragee)) {
                return ok<boolean>(true)
            } else {
                return ko<boolean>(new Error(`The repository "${drageeWithRepositories.repositoryName}" must not be a dependency of "${drageeWithRepositories.dragee.kind_of}"`))
            }
        })
}

export const RepositoryRule = {
    apply: rule
}