import { suite, test, slow, timeout, only } from 'mocha-typescript';
import { assert } from 'chai';
import { check, checkDirectory } from 'typings-tester';
import { join } from 'path';
import { assertTsThrows } from '../helpers';
import JSONAPI from '../../index';

@suite(
	'Top-Level Document Tests: A JSON object MUST be at the root of every JSON API request and response containing data.'
)
class TopLevelDocument {
	@test('string is not a top-level document')
	async stringNotADocument() {
		await assertTsThrows(
			join(__dirname, 'examples/only-string.ts'),
			/is not assignable to type 'Document'/,
			'string is not a valid top-level document'
		);
	}

	@test('boolean is not a top-level document')
	async booleanNotADocument() {
		await assertTsThrows(
			join(__dirname, 'examples/only-boolean.ts'),
			/is not assignable to type 'Document'/,
			'boolean is not a valid top-level document'
		);
	}

	@test('number is not a top-level document')
	async numberNotADocument() {
		await assertTsThrows(
			join(__dirname, 'examples/only-number.ts'),
			/is not assignable to type 'Document'/,
			'number is not a valid top-level document'
		);
	}
	@test('only having a "jsonapi" property is not a top-level document')
	async onlyJsonApiInfo() {
		await assertTsThrows(
			join(__dirname, 'examples/only-jsonapi.ts'),
			/is not assignable to type 'Document'/,
			'having the "jsonapi" property is not enough to be a valid top-level document'
		);
	}
	@test('A few examples of valid documents')
	validEmptyDocuments() {
		let doc: JSONAPI.Document;
		// Only errors
		doc = { errors: [] };
		// Only data
		doc = {
			data: {
				type: 'articles',
				id: '1'
			}
		};
		// Only meta
		doc = { meta: { something: { nested: 'here ' } } };
		// Optional links and included
		doc = {
			data: [],
			links: {
				related: {
					href: 'http://example.com/articles/1/comments',
					meta: {
						count: 10
					}
				}
			}
		};
		// Add optional ImplementationInfo
		doc = { errors: [], jsonapi: {} };
		// ImplementationInfo.Version and ImplementationInfo.Meta are Optional
		doc = { errors: [], jsonapi: { version: '0.2' } };
		// Free-for all (JSON) in meta
		doc = { errors: [], jsonapi: { meta: { something: 'here ' } } };
		doc = { errors: [], jsonapi: { meta: { something: { nested: 'here ' } } } };

		doc = {
			data: [
				{
					type: 'articles',
					id: '1',
					attributes: {
						title: 'JSON API paints my bikeshed!'
					},
					links: {
						self: 'http://example.com/articles/1'
					},
					relationships: {
						author: {
							links: {
								self: 'http://example.com/articles/1/relationships/author',
								related: 'http://example.com/articles/1/author'
							},
							data: { type: 'people', id: '9' }
						},
						comments: {
							links: {
								self: 'http://example.com/articles/1/relationships/comments',
								related: 'http://example.com/articles/1/comments'
							},
							data: [
								{ type: 'comments', id: '5' },
								{ type: 'comments', id: '12' }
							]
						}
					}
				}
			],
			included: [
				{
					type: 'people',
					id: '9',
					attributes: {
						'first-name': 'Dan',
						'last-name': 'Gebhardt',
						twitter: 'dgeb'
					},
					links: {
						self: 'http://example.com/people/9'
					}
				},
				{
					type: 'comments',
					id: '5',
					attributes: {
						body: 'First!'
					},
					relationships: {
						author: {
							data: { type: 'people', id: '2' }
						}
					},
					links: {
						self: 'http://example.com/comments/5'
					}
				},
				{
					type: 'comments',
					id: '12',
					attributes: {
						body: 'I like XML better'
					},
					relationships: {
						author: {
							data: { type: 'people', id: '9' }
						}
					},
					links: {
						self: 'http://example.com/comments/12'
					}
				}
			]
		};
	}
}
