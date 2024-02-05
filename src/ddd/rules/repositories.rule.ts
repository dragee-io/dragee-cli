import type { Dragee, RuleResult } from "@dragee-io/asserter-type";
import { failed, kindOf, successful } from "../ddd-rules.utils.ts";
const isRepository = (dragee: Dragee) => kindOf(dragee, "ddd/repository")
const isService = (dragee: Dragee) => kindOf(dragee, "ddd/service")
const rule = (dragees: Dragee[]): RuleResult[] => {
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
                return successful()
            } else {
                return failed(`The repository "${drageeWithRepositories.repositoryName}" must not be a dependency of "${drageeWithRepositories.dragee.kind_of}"`)
            }
        })
}

export const RepositoryRule = {
    apply: rule
}