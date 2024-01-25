import {type Dragee, failed, type RuleResult, successful} from "../../dragee.model.ts";
import { kindOf } from "../ddd-rules.utils.ts";


const rule = (dragees: Dragee[]): RuleResult[] => {
    const repositoryNames = dragees
        .filter(dragee => kindOf(dragee, "ddd/repository"))
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
            if (kindOf(drageeWithRepositories.dragee, "ddd/service")) {
                return successful()
            } else {
                return failed(`The repository "${drageeWithRepositories.repositoryName}" must not be a dependency of "${drageeWithRepositories.dragee.kind_of}"`)
            }
        })
}

export const RepositoryRule = {
    apply: rule
}