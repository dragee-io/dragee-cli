import type { Dragee } from "../../dragee.model.ts";
import {ko, ok, type Result} from "../../fp/result.model.ts";
import {isRepository, isService} from "../ddd-rules.utils.ts";

const rule = (dragees: Dragee[]): Result<boolean>[] => {
    const repositoryNames = dragees
        .filter(dragee => isRepository(dragee))
        .map(repository => repository.name)

    const drageesWithRepositoryDependencies = dragees
        .map(dragee => {
            if (!dragee.depends_on) {
                return []
            }

            const repositories: string[] =
                Object.keys(dragee.depends_on).filter(name => repositoryNames.includes(name))

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